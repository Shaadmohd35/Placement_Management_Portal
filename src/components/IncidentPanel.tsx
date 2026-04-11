import { DisasterReport } from '@/types/disaster';
import { motion } from 'framer-motion';
import { MapPin, Users, Clock, AlertTriangle } from 'lucide-react';

const urgencyStyles = {
  critical: 'border-destructive/50 glow-danger',
  high: 'border-warning/40 glow-warning',
  medium: 'border-secondary/30 glow-secondary',
  low: 'border-border',
};

const urgencyBadge = {
  critical: 'bg-destructive/20 text-destructive',
  high: 'bg-warning/20 text-warning',
  medium: 'bg-secondary/20 text-secondary',
  low: 'bg-muted text-muted-foreground',
};

const typeIcons: Record<string, string> = {
  earthquake: '🌍', flood: '🌊', fire: '🔥', hurricane: '🌀', tsunami: '🌊', landslide: '⛰️',
};

interface Props {
  reports: DisasterReport[];
}

export function IncidentPanel({ reports }: Props) {
  const verified = reports.filter(r => r.verificationStatus === 'verified');

  return (
    <div className="glass rounded-lg flex flex-col h-full">
      <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between">
        <h2 className="font-heading text-xs font-semibold tracking-wider text-primary">
          <AlertTriangle className="w-3.5 h-3.5 inline mr-2" />
          ACTIVE INCIDENTS
        </h2>
        <span className="text-[10px] font-mono text-muted-foreground bg-accent px-2 py-0.5 rounded">{verified.length}</span>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {verified.slice(0, 10).map((report, i) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`glass rounded-md p-3 border ${urgencyStyles[report.urgency]} cursor-pointer hover:bg-accent/50 transition-colors`}
          >
            <div className="flex items-start justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="text-lg">{typeIcons[report.disasterType]}</span>
                <div>
                  <span className="text-xs font-heading font-semibold">{report.id}</span>
                  <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded ${urgencyBadge[report.urgency]}`}>
                    {report.urgency.toUpperCase()}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground">
                {report.confidenceScore.toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mb-2 line-clamp-1">{report.description}</p>
            <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{report.location.name}</span>
              <span className="flex items-center gap-1"><Users className="w-3 h-3" />{report.peopleAffected.toLocaleString()}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{report.createdAt.toLocaleTimeString()}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
