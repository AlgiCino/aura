export default function AnimatedBackground({ disabled = false }) {
  if (disabled) return null;
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Ultra subtle blobs (opacity <= 0.08) */}
      <div
        className="absolute -inset-[20%] blur-3xl animate-[rotate_80s_linear_infinite]"
        style={{
          opacity: 0.06,
          background:
            'conic-gradient(from 0deg, rgba(168,85,247,0.08), rgba(59,130,246,0.07), rgba(16,185,129,0.07), rgba(245,158,11,0.07), rgba(239,68,68,0.07), rgba(168,85,247,0.08))',
        }}
      />
      <div
        className="absolute -top-40 -left-24 h-[520px] w-[520px] rounded-full blur-3xl animate-[float1_30s_ease-in-out_infinite]"
        style={{ background: '#b1e4ff', opacity: 0.06 }}
      />
      <div
        className="absolute -bottom-40 -right-24 h-[560px] w-[560px] rounded-full blur-3xl animate-[float2_36s_ease-in-out_infinite]"
        style={{ background: '#e3baff', opacity: 0.06 }}
      />
      <div
        className="absolute top-1/3 left-1/4 h-[420px] w-[420px] rounded-full blur-3xl animate-[float3_42s_ease-in-out_infinite]"
        style={{ background: '#baf7e3', opacity: 0.05 }}
      />
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(255,255,255,0.92)' }} />
      <style>{`
        @keyframes rotate { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes float1 { 0%,100% { transform: translate(0,0) } 50% { transform: translate(18px, 22px) } }
        @keyframes float2 { 0%,100% { transform: translate(0,0) } 50% { transform: translate(-20px, -18px) } }
        @keyframes float3 { 0%,100% { transform: translate(0,0) } 50% { transform: translate(22px, -20px) } }
      `}</style>
    </div>
  );
}
