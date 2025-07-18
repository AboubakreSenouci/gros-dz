import Link from "next/link";
import Image from "next/image";
import img from "@/asset/product01.png";

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    description: string;
    price: number;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition-transform transform hover:scale-[1.02] bg-white">
      <div className="relative w-full h-48 group">
        <Image
          src={img}
          alt={product.name}
          fill
          className="object-cover rounded-t-lg group-hover:cursor-pointer"
        />
      </div>

      <div className="p-3 sm:p-4 space-y-1">
        <Link
          href={`/products/${product.id}`}
          className="text-sm sm:text-base font-semibold text-orange-500 hover:underline line-clamp-1"
        >
          {product.name}
        </Link>
        <p className="text-xs text-gray-500 line-clamp-2">
          {product.description}
        </p>
        <p className="text-sm font-bold text-gray-800">${product.price}</p>
      </div>
    </div>
  );
}
