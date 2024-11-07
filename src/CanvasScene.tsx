import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { FaceInfo } from '../src/types/types';

const GeometryWithNormals = ({
  onFaceInfo,
  showBothSides,
  faceColors,
  backCulling,
  frontCulling,
  drawFaces,
  opacity,
}: {
  onFaceInfo: (info: FaceInfo[]) => void;
  showBothSides: boolean;
  faceColors: string[];
  backCulling: boolean;
  frontCulling: boolean;
  drawFaces: boolean;
  opacity: number;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [faceData, setFaceData] = useState<FaceInfo[]>([]);
  const { camera } = useThree();

  useEffect(() => {
    if (!meshRef.current) return;

    const geometry = meshRef.current.geometry;
    geometry.computeVertexNormals();

    const facesInfo: FaceInfo[] = [];
    const position = geometry.attributes.position;
    const color = new Float32Array(position.count * 3); // Color attribute for each vertex

    for (let i = 0; i < position.count; i += 4) {
      // Obtener los vértices del triángulo
      const v0 = new THREE.Vector3().fromBufferAttribute(position, i);
      const v1 = new THREE.Vector3().fromBufferAttribute(position, i + 1);
      const v2 = new THREE.Vector3().fromBufferAttribute(position, i + 2);

      // Calcular la normal de la cara
      const edge1 = new THREE.Vector3().subVectors(v1, v0);
      const edge2 = new THREE.Vector3().subVectors(v1, v2);
      const faceNormal = new THREE.Vector3().crossVectors(edge1, edge2).normalize();

      // Seleccionar el color para la cara
      const faceColor = new THREE.Color(faceColors[(i / 4) % faceColors.length]);

      // Calcular el vector de vista inicial y el producto punto
      const viewVector = new THREE.Vector3().subVectors(v0, camera.position).normalize();
      const dotProduct = faceNormal.dot(viewVector);
      const isFrontFace = dotProduct > 0;
      const visible = (frontCulling && isFrontFace) || (backCulling && !isFrontFace);

      facesInfo.push({
        id: i,
        vertices: [v0, v1, v2],
        normal: faceNormal,
        color: faceColor,
        viewVector,
        dotProduct,
        isFrontFace,
        visible,
      });

      if (visible || drawFaces) {
        const finalColor = visible ? faceColor : new THREE.Color(0, 0, 0);
        color.set(finalColor.toArray(), i * 3);
        color.set(finalColor.toArray(), (i + 1) * 3);
        color.set(finalColor.toArray(), (i + 2) * 3);
        color.set(finalColor.toArray(), (i + 3) * 3);
      } else {
        color.set([0, 0, 0], i * 3);
        color.set([0, 0, 0], (i + 1) * 3);
        color.set([0, 0, 0], (i + 2) * 3);
        color.set([0, 0, 0], (i + 3) * 3);
      }
    }

    geometry.setAttribute('color', new THREE.BufferAttribute(color, 3));
    setFaceData(facesInfo);
    onFaceInfo(facesInfo);
  }, [onFaceInfo, camera, faceColors, backCulling, frontCulling, showBothSides, drawFaces]);

  useFrame(() => {
    if (!meshRef.current || !faceData.length) return;

    const color = new Float32Array(meshRef.current.geometry.attributes.position.count * 3);

    const visibleFaces = faceData.map((face) => {
      const viewVector = new THREE.Vector3().subVectors(camera.position, face.vertices[0]).normalize();
      const dotProduct = face.normal.dot(viewVector);
      const isFrontFace = dotProduct > 0;
      const visible = (frontCulling && isFrontFace) || (backCulling && !isFrontFace);

      if (visible || drawFaces) {
        const finalColor = visible ? face.color : new THREE.Color(0, 0, 0);
        color.set(finalColor.toArray(), face.id * 3);
        color.set(finalColor.toArray(), (face.id + 1) * 3);
        color.set(finalColor.toArray(), (face.id + 2) * 3);
        color.set(finalColor.toArray(), (face.id + 3) * 3);
      } else {
        color.set([0, 0, 0], face.id * 3);
        color.set([0, 0, 0], (face.id + 1) * 3);
        color.set([0, 0, 0], (face.id + 2) * 3);
        color.set([0, 0, 0], (face.id + 3) * 3);
      }

      face.viewVector = viewVector;
      face.dotProduct = dotProduct;
      face.isFrontFace = isFrontFace;
      face.visible = visible;

      return face;
    });

    meshRef.current.geometry.setAttribute('color', new THREE.BufferAttribute(color, 3));
    meshRef.current.geometry.attributes.color.needsUpdate = true;
    onFaceInfo(visibleFaces);
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        vertexColors
        opacity={opacity}
        transparent
        side={showBothSides ? THREE.DoubleSide : THREE.FrontSide}
        wireframe={!drawFaces}
      />
    </mesh>
  );
};

const faceColors = [
  "#FFFF00", // Yellow
  "#EEEEEE", // White
  "#FF0000", // Red
  "#FFA500",  // Orange
  "#00FF00", // Green
  "#0000FF", // Blue
];

const CanvasScene = ({
  onFaceInfo,
  showBothSides,
  backCulling,
  frontCulling,
  drawFaces,
}: {
  onFaceInfo: (info: FaceInfo[]) => void;
  showBothSides: boolean;
  backCulling: boolean;
  frontCulling: boolean;
  drawFaces: boolean;
}) => {

  return (
    <div className="flex flex-col items-center h-full w-full">
      <Canvas camera={{ position: [2.5, 2.5, 2.5] }}>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <GeometryWithNormals
          faceColors={faceColors}
          onFaceInfo={onFaceInfo}
          showBothSides={showBothSides}
          drawFaces={drawFaces}
          backCulling={backCulling}
          frontCulling={frontCulling}
          opacity={backCulling ? 0.5 : 1}
        />
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default CanvasScene;
