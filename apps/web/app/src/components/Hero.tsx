import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative px-6 md:px-12 py-24 max-w-[1400px] mx-auto flex flex-col items-start text-left overflow-hidden">
      {/* Abstract soft shapes for Tonal Layering */}
      <div className="absolute top-0 right-[10%] w-[500px] h-[500px] bg-secondary-container rounded-full mix-blend-multiply blur-[80px] opacity-40 z-0"></div>
      <div className="absolute bottom-0 left-[5%] w-[400px] h-[400px] bg-primary-fixed rounded-full mix-blend-multiply blur-[60px] opacity-50 z-0"></div>

      {/* Asymmetrical layout container */}
      <div className="bg-surface-container-lowest/60 backdrop-blur-3xl rounded-[3rem] p-12 md:p-16 lg:w-[65%] shadow-[0_40px_60px_-15px_rgba(67,70,88,0.06)] relative z-10 border border-outline-variant/15">
        <h1 className="text-5xl md:text-7xl lg:text-[5rem] font-display font-medium leading-[1.1] text-on-surface mb-8 tracking-tight">
          The Digital <br/><span className="text-primary italic font-serif">Sanctuary</span>
        </h1>
        <p className="text-xl text-secondary max-w-lg mb-12 leading-relaxed font-light">
          Experience the clarity of expert pet care within a boutique digital journal that breathes. 
          Intentional asymmetry, tonal layers, and a focus on your companion's well-being.
        </p>
        <Link to="/dashboard" className="inline-flex items-center gap-3 btn-primary shadow-[0_20px_40px_rgba(154,67,69,0.2)] text-lg px-8 py-4">
          Enter Sanctuary
          <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}
