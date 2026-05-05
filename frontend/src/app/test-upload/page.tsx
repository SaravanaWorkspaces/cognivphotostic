'use client';

import CoverImageUploader from '@/components/ui/CoverImageUploader';

export default function TestUploadPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Test Image Upload
          </h1>
          <p className="text-lg text-gray-600">
            Test the cover image upload functionality with real-time feedback
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <CoverImageUploader
            onSuccess={(fileId, url) => {
              console.log('✅ Upload successful!');
              console.log('File ID:', fileId);
              console.log('File URL:', url);
              alert(
                `✅ Image uploaded!\n\nFile ID: ${fileId}\nURL: ${url}\n\nCheck console for full details.`
              );
            }}
            onError={(error) => {
              console.error('❌ Upload error:', error);
            }}
          />
        </div>

        {/* Info Section */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* What Works */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-green-900 mb-3">
              ✅ What Works
            </h3>
            <ul className="space-y-2 text-sm text-green-800">
              <li>✓ Drag & drop upload</li>
              <li>✓ Click to browse files</li>
              <li>✓ Real-time file preview</li>
              <li>✓ Upload progress indicator</li>
              <li>✓ File validation (size, type)</li>
              <li>✓ Dimension checking</li>
              <li>✓ Success/error messages</li>
              <li>✓ Integrates with Strapi API</li>
            </ul>
          </div>

          {/* Requirements */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-blue-900 mb-3">
              📋 Requirements
            </h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>
                <strong>Recommended:</strong> 800×600px
              </li>
              <li>
                <strong>Minimum:</strong> 600×450px
              </li>
              <li>
                <strong>Aspect Ratio:</strong> 4:3
              </li>
              <li>
                <strong>Max File Size:</strong> 5MB
              </li>
              <li>
                <strong>Formats:</strong> JPEG, PNG, WebP
              </li>
            </ul>
          </div>
        </div>

        {/* Quick Test Guide */}
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-amber-900 mb-3">
            🧪 Quick Test Guide
          </h3>
          <ol className="space-y-2 text-sm text-amber-800 list-decimal list-inside">
            <li>
              <strong>Create a test image:</strong> Use{' '}
              <a
                href="https://www.canva.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Canva
              </a>{' '}
              (free, 800×600px template)
            </li>
            <li>
              <strong>Download the image:</strong> Save as JPEG or PNG
            </li>
            <li>
              <strong>Upload here:</strong> Drag & drop or click to select
            </li>
            <li>
              <strong>Check success:</strong> See file ID and URL in alert &
              console
            </li>
            <li>
              <strong>Verify in Strapi:</strong> Check Media Library
            </li>
          </ol>
        </div>

        {/* Troubleshooting */}
        <div className="mt-8 bg-gray-50 border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            🔧 Troubleshooting
          </h3>

          <div className="space-y-4 text-sm">
            <div>
              <p className="font-semibold text-gray-900 mb-1">
                Upload fails with network error?
              </p>
              <p className="text-gray-700">
                Check if Strapi is running on{' '}
                <code className="bg-gray-200 px-2 py-1 rounded">
                  {process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}
                </code>
              </p>
            </div>

            <div>
              <p className="font-semibold text-gray-900 mb-1">
                "File too large" error?
              </p>
              <p className="text-gray-700">
                Images must be under 5MB. Compress using{' '}
                <a
                  href="https://tinypng.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  TinyPNG
                </a>
              </p>
            </div>

            <div>
              <p className="font-semibold text-gray-900 mb-1">
                "Invalid dimensions" error?
              </p>
              <p className="text-gray-700">
                Image must be at least 600×450px. Create in Canva or scale up using{' '}
                <a
                  href="https://squoosh.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Squoosh
                </a>
              </p>
            </div>

            <div>
              <p className="font-semibold text-gray-900 mb-1">
                Upload shows progress but doesn't complete?
              </p>
              <p className="text-gray-700">
                Check Strapi API token in{' '}
                <code className="bg-gray-200 px-2 py-1 rounded">.env.local</code>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-600">
          <p>
            This is a test page. Images are uploaded to Strapi Media Library.
          </p>
          <p className="mt-2">
            Check the browser console (F12) for detailed upload logs.
          </p>
        </div>
      </div>
    </div>
  );
}
