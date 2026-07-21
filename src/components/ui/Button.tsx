import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  href?: string;
}

export function Button({ variant = "primary", children, className, as = "button", ...props }: ButtonProps) {
  const baseClasses = "relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-sm tracking-widest uppercase transition-all duration-300 overflow-hidden group";
  
  const variants = {
    primary: "bg-orange-primary text-white shadow-[0_10px_40px_rgba(255,87,34,0.3)] hover:shadow-[0_15px_50px_rgba(255,87,34,0.5)] hover:-translate-y-1 hover:bg-[#FFB394] hover:text-black",
    secondary: "bg-transparent text-white border-2 border-gray-dark hover:border-orange-primary hover:bg-orange-primary/10",
    outline: "bg-transparent text-orange-primary border-2 border-orange-primary hover:bg-orange-primary hover:text-white"
  };

  const Component = as as any;

  return (
    <Component 
      className={cn(baseClasses, variants[variant], className)}
      {...props}
    >
      <span className="absolute inset-0 w-0 h-0 m-auto bg-white/20 rounded-full transition-all duration-500 ease-out group-hover:w-72 group-hover:h-72"></span>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </Component>
  );
}
