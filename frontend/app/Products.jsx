'use client';

import { useGetProductsQuery } from '@/app/redux/services/productsApi';
import Link from 'next/link';
import Image from 'next/image';

export default function ProductsPage() {
  const { data: products, isLoading, isError } = useGetProductsQuery();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading products</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products?.map((product) => (
          <div key={product._id} className="border rounded-lg p-4 shadow">
            <Link href={`/products/${product._id}`}>
              <div className="relative h-48 mb-4">
              {product.imageUrls && (
                            <Image
                              src={product.imageUrls[0]}
                              alt={product.name}
                              fill
                              className="object-cover rounded-lg"
                              priority
                            />
                          )}
              </div>
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p className="text-gray-600">${product.price}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}