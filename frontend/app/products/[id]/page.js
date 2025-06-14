'use client';

import { useGetProductByIdQuery } from '@/app/redux/services/productsApi';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { data: product, isLoading, isError } = useGetProductByIdQuery(id);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading product</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="container mx-auto p-4">
      <Link href="/products" className="text-blue-500 hover:underline mb-4 block">
        ← Back to Products
      </Link>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div>
          {/* Main Image */}
          <div className="relative h-96 mb-4">
            {product.images?.[0] && (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover rounded-lg"
                priority
              />
            )}
          </div>
          
          {/* Thumbnail Gallery */}
          {product.imageUrls && (
            <div className="grid grid-cols-3 gap-2">
              {product.imageUrls.map((image, index) => (
                <div key={index} className="relative h-24 cursor-pointer hover:opacity-80 transition-opacity">
                  <Image
                    src={image}
                    alt={`${product.name} - ${index + 1}`}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-2xl text-green-600 mb-4">${product.price}</p>
          <p className="text-gray-700 mb-4">{product.description}</p>
          <p className="text-sm text-gray-500">Category: {product.category}</p>
          
          {/* Additional Info */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Added on: {new Date(product.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}