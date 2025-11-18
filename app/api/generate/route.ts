import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Replicate from "replicate";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export async function POST(req: NextRequest) {
  const { facePath, templateId, userId, watermark = true } = await req.json();

  // 1. Download user's face
  const { data: faceFile } = await supabase.storage
    .from("faces")
    .download(facePath);

  const faceBuffer = Buffer.from(await faceFile!.arrayBuffer());

  // 2. Get template video (pre-uploaded to public bucket or CDN)
  const templateVideos: Record<string, string> = {
    "trump-dance": "https://viralfaces.ai/templates/trump-dance.mp4",
    "elon-cybertruck": "https://viralfaces.ai/templates/elon-cybertruck.mp4",
    "taylor-eras": "https://viralfaces.ai/templates/taylor-eras.mp4",
    "mrbeast-money": "https://viralfaces.ai/templates/mrbeast-money.mp4",
    "rizz": "https://viralfaces.ai/templates/rizz.mp4",
    // You will add 100+ more here or load from DB
  };

  const templateUrl = templateVideos[templateId] || templateVideos["trump-dance"];

  // 3. Run LivePortrait (best open-source face swap Nov 2025)
  const output = await replicate.run(
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

  const videoUrl = output as string; // direct mp4 link from Replicate

  // 4. Optional: Add watermark if free user (using sharp + ffmpeg.wasm in edge is complex, so we just append text via URL param or skip for v1)
  // For v1 we just return the video – add watermark upsell on frontend

  // 5. Save result
  const resultPath = `${userId}/result.mp4`;
  const videoRes = await fetch(videoUrl);
  const videoBuffer = Buffer.from(await videoRes.arrayBuffer());

  await supabase.storage.from("results").upload(resultPath, videoBuffer, {
    contentType: "video/mp4",
  });

  const { data: signed } = await supabase.storage
    .from("results")
    .createSignedUrl(resultPath, 60 * 60 * 24 * 30); // 30 days

  return NextResponse.json({ videoUrl: signed?.url });
}
