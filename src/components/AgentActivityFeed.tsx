import { AgentLog } from '@/types/disaster';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Cpu, ShieldCheck, Truck, RotateCw, Zap } from 'lucide-react';

const agentConfig = {
  ingestion: { icon: Zap, color: 'text-secondary', label: 'INGEST' },
  verification: { icon: ShieldCheck, color: 'text-primary', label: 'VERIFY' },
  decision: { icon: Cpu, color: 'text-warning', label: 'DECIDE' },
  dispatch: { icon: Truck, color: 'text-secondary', label: 'DISPATCH' },
  feedback: { icon: RotateCw, color: 'text-primary', label: 'FEEDBACK' },
};

interface Props {
  logs: AgentLog[];
}

export function AgentActivityFeed({ logs }: Props) {
  return (
    <div className="glass rounded-lg flex flex-col h-full">
      <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between">
        <h2 className="font-heading text-xs font-semibold tracking-wider text-primary">
          <Bot className="w-3.5 h-3.5 inline mr-2" />
          AGENT ACTIVITY
        </h2>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-glow" />
          <span className="text-[10px] font-mono text-muted-foreground">STREAMING</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1 font-mono text-[11px]">
        <AnimatePresence initial={false}>
          {logs.slice(0, 30).map((log) => {
            const cfg = agentConfig[log.agentName];
            const Icon = cfg.icon;
            return (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex gap-2 py-1 px-2 rounded hover:bg-accent/30"
              >
                <Icon className={`w-3 h-3 mt-0.5 shrink-0 ${cfg.color}`} />
                <div className="min-w-0">
                  <span className={`${cfg.color} font-semibold`}>[{cfg.label}]</span>
                  <span className="text-foreground ml-1.5">{log.action}</span>
                  {log.details && <span className="text-muted-foreground ml-1">— {log.details}</span>}
                </div>
                <span className="text-muted-foreground/50 ml-auto shrink-0 text-[9px]">
                  {log.timestamp.toLocaleTimeString()}
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
