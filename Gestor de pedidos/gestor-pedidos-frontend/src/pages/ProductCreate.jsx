import { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function ProductCreate() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState(0);
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Obtener token directamente del localStorage
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  console.log("🔐 Debug - Token:", token);
  console.log("🔐 Debug - User:", user);
  console.log("🔐 Debug - User role:", user?.role);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageUrl(""); // Limpiar URL si se sube archivo
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !description || !price) {
      alert("Por favor completa nombre, descripción y precio.");
      return;
    }
    
    if (Number.isNaN(Number(price)) || Number(price) <= 0) {
      alert("El precio debe ser un número válido mayor a 0.");
      return;
    }
    
    setLoading(true);
    
    try {
      // Crear FormData para enviar los datos
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('description', description.trim());
      formData.append('price', parseFloat(price).toString());
      formData.append('stock', stock.toString());
      
      // Manejar imagen - solo una opción (archivo O URL)
      if (imageFile) {
        formData.append('image', imageFile);
      } else if (imageUrl.trim()) {
        formData.append('imageUrl', imageUrl.trim());
      }
      
      console.log("📤 Enviando datos...");
      
      // Configurar headers
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      };
      
      // Si hay archivo, FormData se encarga del Content-Type
      if (imageFile) {
        // FormData automáticamente establece 'multipart/form-data'
      } else {
        config.headers['Content-Type'] = 'application/json';
        // Convertir FormData a objeto regular para JSON
        const jsonData = {};
        formData.forEach((value, key) => {
          jsonData[key] = value;
        });
        
        const response = await api.post("/products", jsonData, config);
        console.log("✅ Producto creado:", response.data);
        alert("Producto creado exitosamente ✨");
        navigate("/admin/products");
        return;
      }
      
      // Si hay imagen file, enviar como FormData
      const response = await api.post("/products", formData, config);
      console.log("✅ Producto creado:", response.data);
      
      alert("Producto creado exitosamente ✨");
      navigate("/admin/products"); // 🔹 Corregí la ruta
      
    } catch (err) {
      console.error("❌ Error creating product:", err);
      console.error("❌ Error response:", err.response?.data);
      
      // Mensaje de error más específico
      if (err.response?.data?.error) {
        alert(`Error: ${err.response.data.error}`);
      } else if (err.response?.status === 401) {
        alert("Error de autenticación. Por favor, inicia sesión nuevamente.");
      } else {
        alert("Error al crear el producto. Verifica la consola para más detalles.");
      }
    } finally {
      setLoading(false);
    }
  };

  const previewImage = imageFile ? URL.createObjectURL(imageFile) : imageUrl;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Crear producto</h1>
        <button 
          onClick={handleSubmit}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:brightness-125 px-4 py-2 rounded-xl text-sm font-medium transition shadow-lg shadow-purple-800/40 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Guardando…" : "+ Guardar Producto"}
        </button>
      </div>

      {/* Form */}
      <form className="card p-6 flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm opacity-80">Nombre *</label>
            <input 
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-purple-400" 
              placeholder="Nombre del producto" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              disabled={loading}
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm opacity-80">Precio *</label>
            <input 
              type="number"
              step="0.01"
              min="0"
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-purple-400" 
              placeholder="0.00" 
              value={price} 
              onChange={(e) => setPrice(e.target.value)} 
              required 
              disabled={loading}
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm opacity-80">Stock</label>
            <input 
              type="number"
              min="0"
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-purple-400" 
              placeholder="0" 
              value={stock} 
              onChange={(e) => setStock(Number(e.target.value))} 
              disabled={loading}
            />
          </div>
          
          
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm opacity-80">URL de imagen</label>
          <input 
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-purple-400" 
            placeholder="https://…" 
            value={imageUrl} 
            onChange={(e) => {
              setImageUrl(e.target.value);
              setImageFile(null); // Limpiar archivo si se usa URL
            }} 
            disabled={loading || imageFile}
          />
          <p className="text-xs opacity-60">
            {imageFile ? "Tienes un archivo seleccionado. Limpia el archivo para usar URL." : ""}
          </p>
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="text-sm opacity-80">Descripción *</label>
          <textarea 
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-purple-400 min-h-24" 
            placeholder="Descripción breve del producto" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            required 
            disabled={loading}
          />
        </div>

        {/* Botón de submit dentro del form */}
        <div className="flex justify-end">
          <button 
            type="button"
            onClick={handleSubmit}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:brightness-125 px-6 py-3 rounded-xl font-medium transition shadow-lg shadow-purple-800/40 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Creando Producto..." : "Crear Producto"}
          </button>
        </div>
      </form>

      {/* Preview */}
      {(name || description || price || previewImage) && (
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Vista previa</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <div className="w-full h-40 rounded-xl overflow-hidden border border-white/10">
                {previewImage ? (
                  <img src={previewImage} alt={name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-white/5 text-sm opacity-60">
                    Sin imagen
                  </div>
                )}
              </div>
            </div>
            <div className="md:col-span-2 flex flex-col gap-2">
              <h3 className="font-semibold text-lg">{name || "Nombre del producto"}</h3>
              <p className="opacity-80">{description || "Descripción del producto"}</p>
              <div className="text-[1.25rem] font-semibold text-purple-300">
                ${price || "0.00"}
              </div>
              <div className="text-sm opacity-70">Stock: {stock}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}