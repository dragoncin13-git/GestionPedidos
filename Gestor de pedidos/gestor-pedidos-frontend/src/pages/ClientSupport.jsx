export default function ClientSupport() {
  const image = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkG..."; // tu base64 completo

  return (
    <div className="p-6 flex items-center justify-center min-h-screen bg-[#1b1525]">
      <img
        src={image}
        alt="Soporte"
        className="rounded-2xl shadow-lg max-w-full h-auto border border-white/20"
      />
    </div>
  );
}
