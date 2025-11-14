import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function ProductEdit() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [stock, setStock] = useState(0);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({ name: "", price: "", image: "", description: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    
    (async () => {
      try {
        const res = await api.get(`/products/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        
        if (!mounted) return;
        
        const product = res.data;
        setName(product.name || "");
        setDescription(product.description || "");
        setPrice(String(product.price || ""));
        setImage(product.image || "");
        setStock(product.stock || 0);
        
      } catch (e) {
        console.error("Error loading product:", e);
        if (!mounted) return;
        // Si hay error, mantener los campos vacíos
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    
    return () => { mounted = false; };
  }, [id, token]);

  const validate = () => {
    const next = { name: "", price: "", image: "", description: "" };
    const trimmedName = name.trim();
    
    if (!trimmedName) next.name = "El nombre es obligatorio";
    else if (trimmedName.length < 2) next.name = "El nombre debe tener al menos 2 caracteres";
    else if (trimmedName.length > 100) next.name = "El nombre no debe superar 100 caracteres";

    const priceNum = Number(price);
    if (!price || isNaN(priceNum)) next.price = "Ingresa un precio numérico";
    else if (priceNum <= 0) next.price = "El precio debe ser mayor a 0";
    else if (priceNum > 9999.99) next.price = "El precio no debe superar 9999.99";

    const desc = (description || "").trim();
    if (!desc) next.description = "La descripción es obligatoria";
    else if (desc.length < 10) next.description = "La descripción debe tener al menos 10 caracteres";
    else if (desc.length > 500) next.description = "La descripción no debe superar 500 caracteres";

    if (image) {
      try {
        new URL(image);
      } catch (e) {
        next.image = "URL de imagen inválida";
      }
    }
    
    setErrors(next);
    return !next.name && !next.price && !next.image && !next.description;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setSaving(true);
    try {
      await api.put(`/products/${id}`, {
        name: name.trim(),
        description: description.trim(),
        price: Number(price),
        image: image.trim() || null,
        stock: stock,
      }, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      
      // Redirigir a la lista de productos después de guardar
      navigate("/products");
      
    } catch (e) {
      console.error("Error updating product:", e);
      alert("Error al actualizar el producto");
    } finally {
      setSaving(false);
    }
  };

  const preview = { id, name, description, price, image };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Editar producto #{id}</h1>
        <div className="flex gap-2">
          <Link to={`/products/${id}`} className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-sm">
            Ver detalle
          </Link>
          <Link to="/products" className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-sm">
            Volver
          </Link>
        </div>
      </div>

      {loading && (
        <div className="card p-6">Cargando producto…</div>
      )}

      {/* Formulario */}
      {!loading && (
        <form noValidate onSubmit={handleSubmit} className="card p-6 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-sm opacity-80">Nombre</label>
              <input 
                id="name" 
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-purple-400" 
                placeholder="Nombre del producto" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
              {errors.name && <div className="text-xs text-red-300">{errors.name}</div>}
            </div>
            
            <div className="flex flex-col gap-2">
              <label htmlFor="price" className="text-sm opacity-80">Precio</label>
              <input 
                id="price" 
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-purple-400" 
                placeholder="0.00" 
                value={price} 
                onChange={(e) => setPrice(e.target.value)} 
                required 
              />
              {errors.price && <div className="text-xs text-red-300">{errors.price}</div>}
            </div>
            
            <div className="flex flex-col gap-2">
              <label htmlFor="stock" className="text-sm opacity-80">Stock</label>
              <input 
                id="stock" 
                type="number"
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-purple-400" 
                placeholder="0" 
                value={stock} 
                onChange={(e) => setStock(Number(e.target.value))} 
              />
            </div>

            <div className="md:col-span-2 flex flex-col gap-2">
              <label htmlFor="description" className="text-sm opacity-80">Descripción</label>
              <textarea 
                id="description" 
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-purple-400" 
                placeholder="Describe el producto" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                rows={3} 
              />
              {errors.description && <div className="text-xs text-red-300">{errors.description}</div>}
            </div>
            
            <div className="md:col-span-2 flex flex-col gap-2">
              <label htmlFor="image" className="text-sm opacity-80">Imagen (URL)</label>
              <input 
                id="image" 
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-purple-400" 
                placeholder="https://…" 
                value={image} 
                onChange={(e) => setImage(e.target.value)} 
              />
              {errors.image && <div className="text-xs text-red-300">{errors.image}</div>}
            </div>
          </div>
          
          <div className="flex justify-end">
            <button 
              type="submit" 
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:brightness-125 px-4 py-2 rounded-xl text-sm font-medium transition shadow-lg shadow-purple-800/40" 
              disabled={saving}
            >
              {saving ? "Guardando…" : "Guardar"}
            </button>
          </div>
        </form>
      )}

      {/* Previsualización */}
      {!loading && (
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Previsualización</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 w-full h-40 rounded-xl overflow-hidden border border-white/10">
              {preview.image ? (
                <img src={preview.image} alt={preview.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full grid place-items-center bg-white/5 text-sm opacity-60">Sin imagen</div>
              )}
            </div>
            <div className="md:col-span-2 flex flex-col gap-2">
              <div className="font-semibold text-lg">{preview.name || "Nombre del producto"}</div>
              <p className="opacity-80">{preview.description || "Descripción del producto"}</p>
              <div className="text-[1.2rem] font-semibold text-purple-300">
                ${preview.price || "0.00"}
              </div>
              <div className="text-sm opacity-70">Stock: {stock}</div>
              
              {/* Mensajes de validación */}
              {(errors.name || errors.price || errors.image || errors.description) && (
                <div className="mt-2 text-sm text-red-300">
                  {errors.name && <div>• {errors.name}</div>}
                  {errors.price && <div>• {errors.price}</div>}
                  {errors.image && <div>• {errors.image}</div>}
                  {errors.description && <div>• {errors.description}</div>}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}