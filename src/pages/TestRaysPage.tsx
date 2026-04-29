import LightRays from '../components/LightRays';

export function TestRaysPage() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <div className="absolute inset-0">
        <LightRays
          raysOrigin="left"
          raysColor="#7C3AED"
          raysSpeed={0.3}
          lightSpread={0.4}
          rayLength={1.2}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0}
          distortion={0}
          pulsating={false}
          fadeDistance={1.1}
          saturation={1.6}
        />
      </div>
      <div className="absolute top-4 left-4 text-white z-10">
        <p>LightRays Test Page</p>
      </div>
    </div>
  );
}
