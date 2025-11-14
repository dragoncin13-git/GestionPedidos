import { useState } from "react";
import api from "../api/api";

export default function RecipeCreate() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [ingredientInput, setIngredientInput] = useState("");
  const [steps, setSteps] = useState("");
  const [image, setImage] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const addIngredient = () => {
    const value = ingredientInput.trim();
    if (!value) return;
    setIngredients((prev) => [...prev, value]);
    setIngredientInput("");
  };

  const removeIngredient = (idx) => {
    setIngredients((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !description || ingredients.length === 0 || !steps) {
      alert("Por favor completa todos los campos obligatorios.");
      return;
    }
    setLoading(true);
    const payload = { name, description, ingredients, steps, image };
    try {
      await api.post("/recipes", payload);
      alert("Receta creada exitosamente ✨");
      setPreview(payload);
    } catch (err) {
      alert("No se pudo guardar en el servidor. Mostrando vista previa local.");
      setPreview(payload);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Crear receta</h1>
        <button
          form="recipe-form"
          type="submit"
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:brightness-125 px-4 py-2 rounded-xl text-sm font-medium transition shadow-lg shadow-purple-800/40"
        >
          {loading ? "Guardando…" : "+ Guardar Receta"}
        </button>
      </div>

      {/* Form */}
      <form id="recipe-form" onSubmit={handleSubmit} className="card p-6 flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm opacity-80">Nombre</label>
            <input
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-purple-400"
              placeholder="Nombre de la receta"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm opacity-80">Imagen (URL)</label>
            <input
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-purple-400"
              placeholder="https://…"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm opacity-80">Descripción</label>
          <textarea
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-purple-400 min-h-24"
            placeholder="Descripción breve de la receta"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        {/* Ingredientes */}
        <div className="flex flex-col gap-3">
          <label className="text-sm opacity-80">Ingredientes</label>
          <div className="flex gap-3">
            <input
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-purple-400"
              placeholder="Ej: 200g harina"
              value={ingredientInput}
              onChange={(e) => setIngredientInput(e.target.value)}
            />
            <button
              type="button"
              onClick={addIngredient}
              className="bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-xl text-sm"
            >
              Agregar
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {ingredients.map((ing, idx) => (
              <span key={idx} className="px-3 py-1 rounded-xl bg-purple-500/30 text-purple-100 text-sm flex items-center gap-2">
                {ing}
                <button type="button" onClick={() => removeIngredient(idx)} className="opacity-70 hover:opacity-100">✕</button>
              </span>
            ))}
          </div>
        </div>

        {/* Pasos */}
        <div className="flex flex-col gap-2">
          <label className="text-sm opacity-80">Pasos</label>
          <textarea
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-purple-400 min-h-32"
            placeholder="Describe los pasos de preparación"
            value={steps}
            onChange={(e) => setSteps(e.target.value)}
            required
          />
        </div>
      </form>

      {/* Preview */}
      {preview && (
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Vista previa</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <div className="w-full h-40 rounded-xl overflow-hidden border border-white/10">
                {preview.image ? (
                  <img src={preview.image} alt={preview.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-white/5 text-sm opacity-60">Sin imagen</div>
                )}
              </div>
            </div>
            <div className="md:col-span-2 flex flex-col gap-2">
              <h3 className="font-semibold text-lg">{preview.name}</h3>
              <p className="opacity-80">{preview.description}</p>
              <div>
                <div className="text-sm opacity-70 mb-1">Ingredientes</div>
                <div className="flex flex-wrap gap-2">
                  {preview.ingredients.map((ing, i) => (
                    <span key={i} className="px-3 py-1 rounded-xl bg-white/10 text-sm">{ing}</span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-sm opacity-70 mb-1">Pasos</div>
                <p className="text-sm opacity-80 whitespace-pre-line">{preview.steps}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}