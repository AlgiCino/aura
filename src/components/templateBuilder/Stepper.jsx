
export default function Stepper({ step = 0, setStep }) {
  const steps = [
    { id: 0, label: "Export" },
    { id: 1, label: "Import" },
    { id: 2, label: "Confirm" },
  ];
  return (
    <div className="flex items-center gap-3">
      {steps.map((s, i) => {
        const active = step === s.id;
        return (
          <button
            key={s.id}
            onClick={() => setStep(s.id)}
            className={[
              "px-3 py-1.5 rounded-full text-sm transition-all",
              "border-[0.5px] border-white/60 backdrop-blur-xl",
              active ? "bg-white/70 text-gray-900 shadow" : "bg-white/40 text-gray-700 hover:bg-white/55",
            ].join(" ")}
          >
            {i + 1}. {s.label}
          </button>
        );
      })}
    </div>
  );
}
