import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col items-center justify-center px-4">
      <h1 className="text-5xl font-bold mb-6">Welcome to ImgConv</h1>
      <p className="text-lg text-gray-300 mb-8 text-center max-w-xl">
        Convert your images to different formats (JPEG, PNG, BMP, WEBP) easily and instantly. Resize them with precision and download in seconds.
      </p>
      <Link
        href="/formatconvert"
        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg transition duration-200"
      >
        Go to Converter
      </Link>
    </main>
  );
}