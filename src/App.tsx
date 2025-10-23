import { Slider } from "./components/slider";

export default function App() {
  const images = [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=1000&fit=crop",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=1000&fit=crop",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=1000&fit=crop",
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=1000&fit=crop",
    "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&h=1000&fit=crop",
    "https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?w=800&h=1000&fit=crop",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=1000&fit=crop",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=1000&fit=crop",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=1000&fit=crop",
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=1000&fit=crop",
    "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&h=1000&fit=crop",
    "https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?w=800&h=1000&fit=crop",
  ];

  return (
    <div className="w-full h-screen  bg-slate-900 flex items-center justify-center overflow-hidden">
      <div className="text-center absolute top-12 left-0 right-0 z-10 mb-20">
        <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
          3D Image Ring
        </h1>
      </div>
      <Slider
        images={images}
        width={350}
        imageDistance={700}
        perspective={1500}
      />
    </div>
  );
}
