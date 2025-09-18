
export default function PageWrapper({ children, className = "" }) {
  return (
    <div className={`min-h-screen w-full bg-white/60 backdrop-blur-lg p-6 ${className}`}>
      {children}
    </div>
  );
}

