import { useState, useEffect, useCallback } from 'react';
import { DisasterReport, Task, AgentLog, SystemStatus } from '@/types/disaster';
import { initialReports, generateReport } from '@/data/mockData';
import { runAgentPipeline, runDispatchAgent, runDecisionAgent } from '@/engine/agentEngine';

export function useDisasterSystem() {
  const [reports, setReports] = useState<DisasterReport[]>(initialReports);
  const [tasks, setTasks] = useState<Task[]>(() => {
    // Generate initial tasks for initial reports
    return initialReports
      .filter(r => r.verificationStatus === 'verified')
      .map(r => {
        const { action } = runDecisionAgent(r);
        const { task } = runDispatchAgent(r, action);
        return task;
      });
  });
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [isRunning, setIsRunning] = useState(true);

  const systemStatus: SystemStatus = {
    activeIncidents: reports.filter(r => r.verificationStatus === 'verified').length,
    pendingTasks: tasks.filter(t => t.status === 'pending' || t.status === 'dispatched').length,
    activeAgents: 5,
    dataStreams: 3,
    uptime: '99.97%',
    threatLevel: reports.some(r => r.urgency === 'critical' && r.verificationStatus === 'verified')
      ? 'red'
      : reports.some(r => r.urgency === 'high' && r.verificationStatus === 'verified')
        ? 'orange'
        : 'yellow',
  };

  const processNewReport = useCallback(() => {
    const newReport = generateReport();
    const result = runAgentPipeline(newReport, reports, tasks);

    setReports(prev => [result.report, ...prev].slice(0, 50));
    if (result.task) {
      setTasks(prev => [result.task!, ...prev].slice(0, 30));
    }
    setLogs(prev => [...result.logs, ...prev].slice(0, 100));
  }, [reports, tasks]);

  // Auto-process new reports
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(processNewReport, 5000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, [isRunning, processNewReport]);

  // Simulate task status updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTasks(prev => prev.map(t => {
        if (t.status === 'dispatched' && Math.random() > 0.7) return { ...t, status: 'active' as const };
        if (t.status === 'active' && Math.random() > 0.85) return { ...t, status: 'completed' as const };
        return t;
      }));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return { reports, tasks, logs, systemStatus, isRunning, setIsRunning, processNewReport };
}
