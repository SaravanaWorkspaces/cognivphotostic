import { notFound } from 'next/navigation';
import { getProducts } from '@/lib/api';
import ProductCard from '@/components/products/ProductCard';

export const revalidate = 3600;

export default async function ProductsPage() {
  try {
    const response = await getProducts({ pageSize: 50 });
    const products = response.data || [];

    return (
      <div className="w-full">
        <div className="container-prose mb-12">
          <h1 className="font-serif text-4xl font-bold text-gray-900 mb-4">
            Recommended Products
          </h1>
          <p className="text-lg text-gray-600">
            Handpicked products for your home decor and lifestyle needs.
          </p>
        </div>

        {products.length > 0 ? (
          <div className="container-wide">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        ) : (
          <div className="container-prose text-center py-12">
            <p className="text-gray-600">No products available yet.</p>
          </div>
        )}
      </div>
    );
  } catch (err) {
    console.error('Failed to load products:', err);
    notFound();
  }
}
