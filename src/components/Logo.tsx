import React, { useState } from "react";

interface LogoProps {
  className?: string;
}

export function Logo({ className = "" }: LogoProps) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className={`flex items-center ${className} ${className.includes('h-') ? '' : 'h-6 md:h-8'}`}>
        <span className="text-white font-black text-xl tracking-tighter">OUT</span>
        <div className="bg-[#E95800] px-1.5 py-0.5 rounded ml-1 flex items-center">
          <span className="text-white font-black text-xl tracking-tighter leading-none">GRID</span>
        </div>
      </div>
    );
  }

  return (
    <img 
      src="https://res.cloudinary.com/ifuatk2z/image/upload/v1721500000/Logotipo_Outgrid_Fundo_escuro_xgpyns.png"
      alt="Outgrid"
      className={`${className.includes('h-') ? '' : 'h-6 md:h-8'} w-auto object-contain ${className}`}
      onError={() => setError(true)}
    />
  );
}
