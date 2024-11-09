import { FaceInfo } from '../types/types';

export function FaceInfoCard({ face }: { face: FaceInfo }) {
  
  return (
    <div 
      className={`rounded-lg overflow-hidden shadow-lg box-border transition-transform duration-300 md:w-full ${face.isFrontFace ? 'scale-105' : 'opacity-50'}`}
    >
      <div 
        className="h-4" 
        style={{ backgroundColor: `rgb(${face.color.r * 255}, ${face.color.g * 255}, ${face.color.b * 255})` }} 
      />
      <div className="bg-white p-4">
        <p className="text-base font-semibold text-gray-800 mt-2">
          <span className="text-blue-900">Normal:</span> ({face.normal.x.toFixed(2)}, {face.normal.y.toFixed(2)}, {face.normal.z.toFixed(2)})
        </p>
        <p className="text-base font-semibold text-gray-800 mt-2">
          <span className="text-blue-900">Visión:</span> ({face.viewVector.x.toFixed(2)}, {face.viewVector.y.toFixed(2)}, {face.viewVector.z.toFixed(2)})
        </p>
        <p className="text-base font-semibold text-gray-800 mt-2">
          <span className="text-blue-900">Producto Punto:</span> {face.dotProduct.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
