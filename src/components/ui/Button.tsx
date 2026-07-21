import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  children: React.ReactNode;
  className?: string;
}

export function Button({ variant = 'primary', children, className = '', ...props }: ButtonProps) {
  const baseStyle = "px-6 py-3 rounded-full font-bold transition-all duration-300 inline-flex items-center justify-center gap-2 cursor-pointer";
  const variants = {
    primary: "bg-orange-primary hover:bg-orange-600 text-white shadow-lg shadow-orange-primary/20",
    secondary: "bg-white/10 hover:bg-white/20 text-white border border-white/20",
    outline: "border border-orange-primary text-orange-primary hover:bg-orange-primary/10"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
