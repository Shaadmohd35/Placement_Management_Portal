import { SystemStatus } from '@/types/disaster';
import { Activity, AlertTriangle, Radio, Shield } from 'lucide-react';

interface StatusBarProps {
  status: SystemStatus;
}

const threatColors = {
  green: 'text-primary',
  yellow: 'text-warning',
  orange: 'text-warning',
  red: 'text-destructive',
};

export function StatusBar({ status }: StatusBarProps) {
  return (
    <header className="glass-strong h-14 flex items-center justify-between px-6 border-b border-border/50 z-50">
      <div className="flex items-center gap-3">
        <Shield className="w-5 h-5 text-primary" />
        <span className="font-heading text-sm font-semibold tracking-wider text-primary text-glow-primary">
          AEGIS COMMAND
        </span>
        <span className="text-xs text-muted-foreground font-mono">v2.4.1</span>
      </div>

      <div className="flex items-center gap-6">
        <StatusItem icon={<AlertTriangle className="w-3.5 h-3.5" />} label="INCIDENTS" value={status.activeIncidents} className={threatColors[status.threatLevel]} />
        <StatusItem icon={<Activity className="w-3.5 h-3.5" />} label="TASKS" value={status.pendingTasks} className="text-secondary" />
        <StatusItem icon={<Radio className="w-3.5 h-3.5" />} label="AGENTS" value={status.activeAgents} className="text-primary" />

        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full animate-pulse-glow ${status.threatLevel === 'red' ? 'bg-destructive' : status.threatLevel === 'orange' ? 'bg-warning' : 'bg-primary'}`} />
          <span className="text-xs font-mono text-muted-foreground">LIVE</span>
        </div>
      </div>
    </header>
  );
}

function StatusItem({ icon, label, value, className }: { icon: React.ReactNode; label: string; value: number | string; className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {icon}
      <span className="text-[10px] font-mono text-muted-foreground">{label}</span>
      <span className="text-sm font-heading font-bold">{value}</span>
    </div>
  );
}
