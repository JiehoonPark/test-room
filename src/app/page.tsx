import ImageEditor from "@/components/ImageEditor";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6">박지훈의 실험실</h1>
      <ImageEditor src="/original-image.png" />
    </main>
  );
}
