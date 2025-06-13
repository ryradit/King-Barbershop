
// src/components/ui/HaircutModelViewer.tsx
"use client";

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Preload, Html } from '@react-three/drei';
import { Loader2 } from 'lucide-react';

// Model Component
function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  // IMPORTANT: Adjust scale and position as needed for your specific .glb models.
  // Example: <primitive object={scene} scale={1.3} position={[0, -0.5, 0]} />
  return <primitive object={scene} scale={1.3} position={[0, -0.5, 0]} />;
}

// Canvas Loader Component
function CanvasLoader() {
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-2 text-sm text-muted-foreground">Loading 3D Model...</p>
      </div>
    </Html>
  );
}

interface HaircutModelViewerProps {
  modelUrl: string;
}

export default function HaircutModelViewer({ modelUrl }: HaircutModelViewerProps) {
  if (!modelUrl) {
    return <div className="w-full h-[400px] flex items-center justify-center bg-muted/50 rounded-md"><p>No 3D model available.</p></div>;
  }

  return (
    <div className="w-full h-[400px] bg-muted/30 rounded-md relative shadow-inner">
      <Canvas
        frameloop="demand"
        shadows
        // Adjusted camera: Closer position (Z value from 2.5 to 2.0) and smaller FOV (from 35 to 30)
        // Model scale also increased in Model component
        camera={{ position: [1, 0.2, 2.0], fov: 30 }}
        gl={{ preserveDrawingBuffer: true }}
      >
        <Suspense fallback={<CanvasLoader />}>
          <ambientLight intensity={0.7} /> {/* Reduced from 1.8 */}
          <directionalLight
            position={[3, 5, 4]}
            intensity={1.8} // Reduced from 3.5
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <directionalLight position={[-3, -2, -4]} intensity={1.0} /> {/* Reduced from 1.2 */}

          <Model url={modelUrl} />

          <OrbitControls
            enableZoom={true}
            enablePan={true} 
            minDistance={1.0} 
            maxDistance={10}
            target={[0, -0.5, 0]} // Orbit around the model's Y position
          />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
