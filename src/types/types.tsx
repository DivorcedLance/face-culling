import * as THREE from 'three';

export interface FaceInfo {
  id: number;
  vertices: THREE.Vector3[];
  normal: THREE.Vector3;
  color: THREE.Color;
  viewVector: THREE.Vector3;
  dotProduct: number;
  isFrontFace: boolean;
  visible: boolean;
}