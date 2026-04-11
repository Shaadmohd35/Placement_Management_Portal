import { Task } from '@/types/disaster';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Truck, Circle } from 'lucide-react';

const statusConfig = {
  pending: { icon: Circle, color: 'text-muted-foreground', bg: 'bg-muted' },
  dispatched: { icon: Truck, color: 'text-secondary', bg: 'bg-secondary/20' },
  active: { icon: Clock, color: 'text-warning', bg: 'bg-warning/20' },
  completed: { icon: CheckCircle2, color: 'text-primary', bg: 'bg-primary/20' },
};

interface Props {
  tasks: Task[];
}

export function TaskPanel({ tasks }: Props) {
  return (
    <div className="glass rounded-lg flex flex-col h-full">
      <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between">
        <h2 className="font-heading text-xs font-semibold tracking-wider text-secondary">
          <Truck className="w-3.5 h-3.5 inline mr-2" />
          TASK DISPATCH
        </h2>
        <span className="text-[10px] font-mono text-muted-foreground bg-accent px-2 py-0.5 rounded">{tasks.length}</span>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {tasks.slice(0, 12).map((task, i) => {
          const cfg = statusConfig[task.status];
          const Icon = cfg.icon;
          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="glass rounded-md px-3 py-2.5 flex items-center gap-3 hover:bg-accent/50 transition-colors"
            >
              <div className={`w-7 h-7 rounded flex items-center justify-center ${cfg.bg}`}>
                <Icon className={`w-3.5 h-3.5 ${cfg.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-heading font-semibold">{task.id}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${cfg.bg} ${cfg.color}`}>
                    {task.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground truncate">{task.assignedTeam} • {task.actionType.replace('_', ' ')}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-muted-foreground">ETA</span>
                <p className="text-xs font-heading text-secondary">{task.eta}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
