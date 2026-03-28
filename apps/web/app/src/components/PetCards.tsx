
import { Activity, Thermometer, Droplets, Heart } from 'lucide-react';

export function PetStatusChip({ status, label }: { status: 'healthy' | 'attention', label: string }) {
  const isHealthy = status === 'healthy';
  return (
    <div className={`px-5 py-2.5 rounded-full flex items-center gap-3 w-max text-sm font-medium shadow-sm transition-all hover:scale-105 ${isHealthy ? 'bg-surface-container-lowest text-tertiary border border-outline-variant/20' : 'bg-primary-fixed text-primary'}`}>
       <div className={`w-2 h-2 rounded-full ${isHealthy ? 'bg-tertiary' : 'bg-primary'} animate-pulse`}></div>
       {label}
    </div>
  );
}

export function InsightCard({ title, value, icon, trend }: { title: string, value: string, icon: 'activity' | 'temp' | 'water' | 'heart', trend?: string }) {
  const getIcon = () => {
    switch(icon) {
      case 'activity': return <Activity size={22} className="text-primary" />;
      case 'temp': return <Thermometer size={22} className="text-secondary" />;
      case 'water': return <Droplets size={22} className="text-tertiary" />;
      case 'heart': return <Heart size={22} className="text-primary-container" />;
    }
  }

  return (
    <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-[0_20px_40px_-20px_rgba(67,70,88,0.08)] hover:-translate-y-2 transition-all duration-300">
      <div className="bg-surface-container-low w-14 h-14 rounded-full flex items-center justify-center mb-6">
        {getIcon()}
      </div>
      <h3 className="text-secondary text-base font-medium mb-2">{title}</h3>
      <div className="flex items-baseline gap-3">
        <span className="text-4xl font-display font-medium text-on-surface tracking-tight">{value}</span>
        {trend && <span className="text-primary text-sm font-medium bg-primary-container/20 px-2 py-1 rounded-md">{trend}</span>}
      </div>
    </div>
  );
}

export function PulseTooltip({ content }: { content: string }) {
  return (
    <div className="glass-tooltip p-6 rounded-[2rem] text-on-tertiary-container shadow-xl max-w-sm">
      <div className="flex gap-4">
        <div className="mt-1 w-2 h-2 rounded-full bg-primary animate-pulse shrink-0"></div>
        <p className="text-sm leading-relaxed">{content}</p>
      </div>
    </div>
  );
}
