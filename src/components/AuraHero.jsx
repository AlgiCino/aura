export default function AuraHero() {
  return (
    <div className="relative mx-auto w-fit py-8">
      <h1 className="relative z-10 text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900">
        <span className="relative inline-block px-6 py-3">
          <span className="relative z-10">Aura</span>
          
          {/* طبقة زجاج للنص */}
          <span className="pointer-events-none absolute inset-0 -z-10 rounded-3xl
                           bg-white/30 backdrop-blur-xl
                           border-[0.5px] border-white/60
                           shadow-[inset_0_1px_0_rgba(255,255,255,.7),0_15px_40px_rgba(0,0,0,.08)]" />
          
          {/* هالة خفيفة نابضة */}
          <span className="pointer-events-none absolute -inset-6 -z-20 rounded-[2rem]
                           bg-[radial-gradient(closest-side,rgba(168,85,247,.3),transparent_70%)]
                           blur-xl animate-pulse" />
          
          {/* تموّج لزج على النص */}
          <span className="pointer-events-none absolute inset-0 -z-10 rounded-3xl
                           bg-[linear-gradient(90deg,transparent_40%,rgba(255,255,255,.55),transparent_60%)]
                           bg-[length:200%_100%] animate-[shimmer_8s_ease-in-out_infinite]" />
        </span>
      </h1>
      
      <p className="text-center text-lg text-gray-600 mt-4 font-medium">
        Platform Development Hub
      </p>
      
      <style>{`
        @keyframes shimmer { 
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}