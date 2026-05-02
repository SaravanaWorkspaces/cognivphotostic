import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="container-wide py-32 text-center">
      <h1 className="font-serif text-6xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-lg text-gray-500 mb-8">Page not found</p>
      <Link
        href="/"
        className="inline-block bg-brand-500 text-white px-6 py-3 rounded-lg hover:bg-brand-600 transition-colors"
      >
        Back home
      </Link>
    </main>
  );
}
