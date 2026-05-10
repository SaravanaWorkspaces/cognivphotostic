import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-brand-100 bg-gray-50 mt-16">
      <div className="container-wide py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-serif text-lg font-bold text-brand-900 mb-2">
              CognivPhotostic
            </h3>
            <p className="text-sm text-gray-600">
              Interior, lifestyle and fashion stories with a South Indian soul.
            </p>
          </div>

          <div>
            <h4 className="font-medium text-sm mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/blog" className="text-gray-600 hover:text-brand-600">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/#featured" className="text-gray-600 hover:text-brand-600">
                  Featured
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-sm mb-4">About</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/api/health"
                  className="text-gray-600 hover:text-brand-600"
                >
                  Health Check
                </a>
              </li>
              <li>
                <a
                  href="https://anthropic.com"
                  className="text-gray-600 hover:text-brand-600"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Built with Claude
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 text-center text-sm text-gray-600">
          <p>
            © {currentYear} CognivPhotostic. All rights reserved. | Affiliate Links
            Disclosure
          </p>
        </div>
      </div>
    </footer>
  );
}
