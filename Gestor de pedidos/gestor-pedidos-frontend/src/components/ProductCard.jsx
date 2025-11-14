import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <div className="card p-5 flex flex-col gap-4 transition transform hover:scale-[1.03] hover:shadow-[0_0_25px_rgba(175,140,255,0.4)] duration-300">
      
      {/* Imagen */}
      <div className="w-full h-40 rounded-xl overflow-hidden border border-white/10">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition transform hover:scale-110 duration-500"
        />
      </div>

      {/* Nombre & Descripción */}
      <div className="flex flex-col gap-1">
        <h3 className="font-semibold text-lg tracking-wide">{product.name}</h3>
        <p className="text-sm opacity-70 leading-snug">{product.description}</p>
      </div>

      {/* Price & Action */}
      <div className="flex justify-between items-center mt-auto">
        <div className="text-[1.25rem] font-semibold text-purple-300">
          ${product.price}
        </div>

        <div className="flex gap-2">
          <Link
            to={`/products/${product.id}`}
            className="bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-xl text-sm"
          >
            Ver detalle
          </Link>
          <Link
            to={`/products/${product.id}/edit`}
            className="bg-gradient-to-r from-purple-500/60 to-pink-500/60 hover:from-purple-500 hover:to-pink-500 border border-white/10 px-4 py-2 rounded-xl text-sm font-medium transition"
          >
            Editar
          </Link>
        </div>
      </div>
    </div>
  );
}
