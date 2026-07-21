import { Logo } from "./Logo";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export function ProtectedPage({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black-main text-white font-sans selection:bg-orange-primary/30 flex flex-col">
      <div className="absolute top-6 left-6 z-50">
        <Link to="/" className="flex items-center gap-2">
          <Logo />
        </Link>
      </div>
      <div className="absolute top-6 right-6 z-50">
        <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Voltar para Home</span>
        </Link>
      </div>
      <main className="flex-1 w-full flex flex-col">
        {children}
      </main>
    </div>
  );
}
