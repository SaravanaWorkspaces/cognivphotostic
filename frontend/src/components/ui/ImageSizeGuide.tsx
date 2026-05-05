import { IMAGE_SIZES, ImageSizeKey } from '@/lib/image-sizes';

interface ImageSizeGuideProps {
  sizeKey?: ImageSizeKey;
  compact?: boolean;
}

export default function ImageSizeGuide({
  sizeKey = 'COVER_IMAGE',
  compact = false,
}: ImageSizeGuideProps) {
  const size = IMAGE_SIZES[sizeKey] as any;

  if (compact) {
    return (
      <div className="text-xs text-gray-600 bg-blue-50 rounded p-2 border border-blue-200">
        <span className="font-semibold">Recommended size:</span> {size.width}×{size.height}px ({size.aspectRatio})
      </div>
    );
  }

  return (
    <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
      <h3 className="font-semibold text-sm text-gray-900 mb-3">
        📸 Image Size Recommendations
      </h3>

      <div className="space-y-2 text-sm">
        <div>
          <p className="font-medium text-gray-700">{size.description}</p>
          <ul className="mt-1 space-y-1 text-gray-600 ml-4">
            <li>
              ✓ <strong>Recommended:</strong> {size.width}×{size.height}px
            </li>
            <li>
              <strong>Aspect Ratio:</strong> {size.aspectRatio}
            </li>
            {size.minWidth !== undefined && size.minHeight !== undefined && (
              <li>
                ℹ️ <strong>Minimum:</strong> {size.minWidth}×{size.minHeight}px
              </li>
            )}
            {size.maxWidth !== undefined && size.maxHeight !== undefined && (
              <li>
                ⚠️ <strong>Maximum:</strong> {size.maxWidth}×{size.maxHeight}px
              </li>
            )}
          </ul>
        </div>

        <div className="pt-2 mt-2 border-t border-blue-200">
          <p className="text-xs text-gray-600 italic">
            💡 Using properly sized images ensures fast loading and better user experience. Images will be optimized automatically.
          </p>
        </div>
      </div>
    </div>
  );
}

interface ImageSizeGuideCompactProps {
  sizeKey?: ImageSizeKey;
}

export function ImageSizeGuideBadge({
  sizeKey = 'COVER_IMAGE',
}: ImageSizeGuideCompactProps) {
  const size = IMAGE_SIZES[sizeKey];

  return (
    <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
      <span>🖼️</span>
      <span>
        {size.width}×{size.height}px
      </span>
    </div>
  );
}
