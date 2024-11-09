import { useState } from 'react';
import CanvasScene from './CanvasScene';
import { FaceInfo } from '../src/types/types';
import { FaceInfoCard } from './components/FaceInfoCard';

const App = () => {
  const [facesInfo, setFacesInfo] = useState<FaceInfo[]>([]);
  const [backCulling, setBackCulling] = useState(true);
  const [frontCulling, setFrontCulling] = useState(false);
  const [drawFaces, setDrawFaces] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    // media query to change main div to flex colum
    <div className='flex h-screen flex-col md:flex-row'>
      <div className='flex w-full h-1/2 md:w-3/4 md:h-full bg-white'>
        <CanvasScene
          onFaceInfo={setFacesInfo}
          showBothSides={true}
          backCulling={backCulling}
          frontCulling={frontCulling}
          drawFaces={drawFaces}
        />
        
        {/* Botón flotante para abrir/cerrar el menú */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className='fixed top-4 left-4 bg-black text-white p-2 rounded-full shadow-lg hover:bg-blue-600 focus:outline-none'
        >
          ⚙️
        </button>

        {isMenuOpen && (
          <div className="fixed top-16 left-4 bg-gray-900 p-4 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <input
            type="radio"
            checked={backCulling}
            onChange={() => {
              setBackCulling(true);
              setFrontCulling(false);
            }}
            className="form-radio"
            />
            <span className='text-white font-bold'>Back Culling</span>
            <input
            type="radio"
            checked={frontCulling}
            onChange={() => {
              setBackCulling(false);
              setFrontCulling(true);
            }}
            className="form-radio"
            />
            <span className='text-white font-bold'>Front Culling</span>
          </div>
          <label className="flex items-center space-x-2 mt-2">
            <input
            type="checkbox"
            checked={drawFaces}
            onChange={() => setDrawFaces(!drawFaces)}
            className="form-checkbox"
            />
            <span className='text-white font-bold'>Dibujar caras</span>
          </label>
          </div>
        )}
      </div>

      <div className='flex flex-col text-xl bg-white overflow-y-scroll no-scrollbar md:items-end p-4 w-full md:w-1/4'>
        <div className='grid grid-cols-2 md:w-full md:flex md:flex-col gap-3'>
          {facesInfo.map((face, index) => (
            <FaceInfoCard key={index} face={face} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
