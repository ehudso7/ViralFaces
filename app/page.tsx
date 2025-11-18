import UploadForm from "@/components/UploadForm";
import TemplateGallery from "@/components/TemplateGallery";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="py-20 px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
          ViralFaces AI
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
          Upload a selfie → Pick any viral template → Get an ultra-realistic video in seconds
        </p>
        <UploadForm />
      </section>

      <section className="py-20 px-6">
        <h2 className="text-4xl font-bold text-center mb-12">Choose Your Viral Moment</h2>
        <TemplateGallery />
      </section>

      <footer className="py-12 text-center text-gray-500">
        © 2025 ViralFaces AI — Make yourself famous
      </footer>
    </main>
  );
}
