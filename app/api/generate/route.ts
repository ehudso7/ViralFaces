import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Replicate from "replicate";
import { v4 as uuidv4 } from "uuid";

// Valid template IDs
const VALID_TEMPLATES = [
  "trump-dance",
  "elon-cybertruck",
  "taylor-eras",
  "mrbeast-money",
  "rizz"
];

export async function POST(req: NextRequest) {
  try {
    // Initialize services (lazy load to avoid build-time errors)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const replicateToken = process.env.REPLICATE_API_TOKEN;

    if (!supabaseUrl || !supabaseKey || !replicateToken) {
      console.error("Missing required environment variables");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const replicate = new Replicate({
      auth: replicateToken,
    });

    // Parse request body
    const body = await req.json();
    const { facePath, templateId, userId } = body;

    // Validate required fields
    if (!facePath || !templateId || !userId) {
      return NextResponse.json(
        { error: "Missing required fields: facePath, templateId, userId" },
        { status: 400 }
      );
    }

    // Validate facePath to prevent path traversal attacks
    if (
      typeof facePath !== "string" ||
      facePath.includes("..") ||
      facePath.includes("//") ||
      facePath.startsWith("/")
    ) {
      return NextResponse.json(
        { error: "Invalid facePath" },
        { status: 400 }
      );
    }

    // Validate templateId against known templates
    if (!VALID_TEMPLATES.includes(templateId)) {
      return NextResponse.json(
        { error: `Invalid templateId. Must be one of: ${VALID_TEMPLATES.join(", ")}` },
        { status: 400 }
      );
    }

    // 1. Download user's face
    const { data: faceFile, error: downloadError } = await supabase.storage
      .from("faces")
      .download(facePath);

    if (downloadError || !faceFile) {
      console.error("Failed to download face image:", downloadError);
      const errorMsg = downloadError?.message || "Unknown error";

      // Provide helpful error for bucket issues
      if (errorMsg.includes('Bucket not found') || errorMsg.includes('bucket')) {
        return NextResponse.json(
          { error: 'Storage not configured', message: 'Please create Supabase storage buckets. See SETUP.md for instructions.' },
          { status: 503 }
        );
      }

      return NextResponse.json(
        { error: "Failed to download face image", details: errorMsg },
        { status: 404 }
      );
    }

    const faceBuffer = Buffer.from(await faceFile.arrayBuffer());

    // 2. Get template video URL
    // Template videos need to be uploaded to a public CDN or Supabase storage
    // For demo purposes, you can use publicly accessible videos
    const templateVideos: Record<string, string> = {
      // TODO: Replace these with your actual template video URLs
      // Upload your template videos to Supabase storage bucket "templates" or a CDN
      // and update these URLs accordingly
      "trump-dance": process.env.TEMPLATE_TRUMP_DANCE_URL || "",
      "elon-cybertruck": process.env.TEMPLATE_ELON_URL || "",
      "taylor-eras": process.env.TEMPLATE_TAYLOR_URL || "",
      "mrbeast-money": process.env.TEMPLATE_MRBEAST_URL || "",
      "rizz": process.env.TEMPLATE_RIZZ_URL || "",
    };

    const templateUrl = templateVideos[templateId];

    if (!templateUrl || templateUrl === "") {
      console.error(`Template video URL not configured for: ${templateId}`);
      return NextResponse.json(
        {
          error: "Template video not configured",
          message: `The template "${templateId}" is not set up yet. Please upload template videos to a CDN or Supabase storage and add the URLs to your environment variables (TEMPLATE_${templateId.toUpperCase().replace(/-/g, '_')}_URL).`,
          details: "See SETUP.md for instructions on setting up template videos."
        },
        { status: 503 }
      );
    }

    // Validate template URL is accessible
    try {
      const templateCheck = await fetch(templateUrl, { method: 'HEAD' });
      if (!templateCheck.ok) {
        throw new Error(`Template video not accessible: ${templateCheck.status}`);
      }
    } catch (urlCheckError) {
      console.error("Template URL validation failed:", urlCheckError);
      return NextResponse.json(
        {
          error: "Template video not accessible",
          message: `Unable to access the template video at ${templateUrl}. Please check the URL is correct and publicly accessible.`,
          details: urlCheckError instanceof Error ? urlCheckError.message : "Unknown error"
        },
        { status: 503 }
      );
    }

    // 3. Run LivePortrait (best open-source face swap Nov 2025)
    console.log(`Starting face swap for user ${userId} with template ${templateId}`);

    let output: unknown;
    try {
      output = await replicate.run(
        "fofr/liveportrait:9f15898c2cd6e85e9e5807f2ead2d5c7f0f2c285c3e7a42e1f0e2028acdf9e76",
        {
          input: {
            face_image: faceBuffer,
            source_video: templateUrl,
            lip_sync: true,
            eye_open_ratio: 1.0,
            cheek_puff: 0,
            wink: "none",
            output_format: "mp4"
          }
        }
      );

      if (!output) {
        throw new Error("Replicate returned no output");
      }
    } catch (replicateError) {
      console.error("Replicate API error:", replicateError);
      return NextResponse.json(
        {
          error: "Face swap generation failed",
          details: replicateError instanceof Error ? replicateError.message : "Unknown error"
        },
        { status: 500 }
      );
    }

    // Validate output is a string URL
    if (typeof output !== "string") {
      console.error("Unexpected output from Replicate:", output);
      return NextResponse.json(
        { error: "Failed to generate video - invalid output from AI service" },
        { status: 500 }
      );
    }

    // Validate output is a valid URL
    try {
      const url = new URL(output);
      if (url.protocol !== "http:" && url.protocol !== "https:") {
        throw new Error("Invalid protocol");
      }
    } catch (urlError) {
      console.error("Output is not a valid URL:", output, urlError);
      return NextResponse.json(
        { error: "Failed to generate video - invalid URL from AI service" },
        { status: 500 }
      );
    }

    const videoUrl = output;

    // 4. Download generated video from Replicate
    const videoRes = await fetch(videoUrl);
    if (!videoRes.ok) {
      console.error("Failed to fetch generated video:", videoRes.status, videoRes.statusText);
      return NextResponse.json(
        { error: "Failed to fetch generated video from Replicate", status: videoRes.status },
        { status: 500 }
      );
    }

    const videoBuffer = Buffer.from(await videoRes.arrayBuffer());

    // 5. Save result with unique filename to prevent race conditions
    const resultId = uuidv4();
    const resultPath = `${userId}/${resultId}.mp4`;

    const { error: uploadError } = await supabase.storage
      .from("results")
      .upload(resultPath, videoBuffer, {
        contentType: "video/mp4",
        upsert: false, // Fail if file already exists instead of overwriting
      });

    if (uploadError) {
      console.error("Failed to save video to storage:", uploadError);

      // Provide helpful error for bucket issues
      if (uploadError.message.includes('Bucket not found') || uploadError.message.includes('bucket')) {
        return NextResponse.json(
          { error: 'Storage not configured', message: 'Please create Supabase "results" bucket. See SETUP.md for instructions.' },
          { status: 503 }
        );
      }

      return NextResponse.json(
        { error: "Failed to save video to storage", details: uploadError.message },
        { status: 500 }
      );
    }

    // 6. Generate signed URL for download
    const { data: signed, error: signError } = await supabase.storage
      .from("results")
      .createSignedUrl(resultPath, 60 * 60 * 24 * 30); // 30 days

    if (signError || !signed?.signedUrl) {
      console.error("Failed to generate download URL:", signError);
      return NextResponse.json(
        { error: "Failed to generate download URL", details: signError?.message },
        { status: 500 }
      );
    }

    console.log(`Successfully generated video for user ${userId}: ${resultPath}`);

    return NextResponse.json({
      videoUrl: signed.signedUrl,
      resultId,
      templateId
    });

  } catch (error) {
    console.error("Video generation error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate video",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
