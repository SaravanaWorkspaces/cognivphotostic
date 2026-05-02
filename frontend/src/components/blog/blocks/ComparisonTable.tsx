import { ComparisonTableBlock } from '@/types';

interface ComparisonTableProps {
  block: ComparisonTableBlock;
}

export default function ComparisonTable({ block }: ComparisonTableProps) {
  if (!block.rows || block.rows.length === 0) return null;

  return (
    <div className="my-8 overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-brand-50">
            <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
              {block.title || 'Feature'}
            </th>
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row, idx) => (
            <tr key={row.id || idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="border border-gray-300 px-4 py-3 text-gray-900 font-medium">
                {row.feature}
              </td>
              <td className="border border-gray-300 px-4 py-3 text-gray-700">
                {row.values}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
