import { DisasterReport, Task, AgentLog, AgentName, ActionType } from '@/types/disaster';

const teams = ['Alpha Response Unit', 'Bravo Medical Team', 'Charlie Supply Corps', 'Delta Evac Squad', 'Echo Search & Rescue', 'Foxtrot Relief Team'];

function createLog(agent: AgentName, action: string, details?: string): AgentLog {
  return { id: crypto.randomUUID(), agentName: agent, action, details, timestamp: new Date() };
}

// Ingestion Agent: extracts structured data
export function runIngestionAgent(report: DisasterReport): { report: DisasterReport; logs: AgentLog[] } {
  const logs: AgentLog[] = [];
  logs.push(createLog('ingestion', `Received report from ${report.source}`, `Location: ${report.location.name}, Type: ${report.disasterType}`));
  logs.push(createLog('ingestion', 'Extracted structured fields', `Urgency: ${report.urgency}, Affected: ${report.peopleAffected}`));
  return { report, logs };
}

// Verification Agent: score and verify
export function runVerificationAgent(report: DisasterReport, existingReports: DisasterReport[]): { report: DisasterReport; logs: AgentLog[] } {
  const logs: AgentLog[] = [];

  // Check duplicates
  const isDupe = existingReports.some(r =>
    r.location.name === report.location.name &&
    r.disasterType === report.disasterType &&
    Math.abs(r.createdAt.getTime() - report.createdAt.getTime()) < 60000
  );

  if (isDupe) {
    report.verificationStatus = 'duplicate';
    report.confidenceScore = 0;
    logs.push(createLog('verification', 'Duplicate detected — report rejected', report.id));
    return { report, logs };
  }

  // Confidence scoring
  let score = 0.5;
  if (report.source === 'government') score += 0.3;
  else if (report.source === 'manual') score += 0.15;
  if (report.urgency === 'critical') score += 0.1;
  if (report.peopleAffected > 500) score += 0.1;
  score = Math.min(score, 1);
  score = parseFloat((score + (Math.random() * 0.1 - 0.05)).toFixed(2));
  score = Math.max(0, Math.min(1, score));

  report.confidenceScore = score;
  report.verificationStatus = score > 0.4 ? 'verified' : 'rejected';

  logs.push(createLog('verification', `Confidence score: ${score.toFixed(2)}`, `Status: ${report.verificationStatus}`));
  return { report, logs };
}

// Decision Agent: prioritize and determine action
export function runDecisionAgent(report: DisasterReport): { report: DisasterReport; action: ActionType; logs: AgentLog[] } {
  const logs: AgentLog[] = [];

  const urgencyWeights = { critical: 1.0, high: 0.75, medium: 0.5, low: 0.25 };
  const peopleWeight = Math.min(report.peopleAffected / 5000, 1);
  const priority = (urgencyWeights[report.urgency] * 0.4) + (peopleWeight * 0.3) + (report.confidenceScore * 0.3);
  report.priority = parseFloat(priority.toFixed(3));

  // Determine action
  let action: ActionType = 'rescue_team';
  if (report.disasterType === 'flood' || report.disasterType === 'tsunami') action = 'evacuation';
  else if (report.disasterType === 'earthquake' || report.disasterType === 'landslide') action = 'rescue_team';
  else if (report.disasterType === 'fire') action = 'rescue_team';
  else if (report.disasterType === 'hurricane') action = 'shelter';
  if (report.peopleAffected > 2000) action = 'evacuation';

  logs.push(createLog('decision', `Priority score: ${report.priority}`, `Action: ${action}`));
  logs.push(createLog('decision', `Decision: Deploy ${action.replace('_', ' ')}`, `For ${report.location.name}`));

  return { report, action, logs };
}

// Dispatch Agent: assign tasks
export function runDispatchAgent(report: DisasterReport, action: ActionType): { task: Task; logs: AgentLog[] } {
  const logs: AgentLog[] = [];
  const team = teams[Math.floor(Math.random() * teams.length)];
  const etaMinutes = Math.floor(Math.random() * 45) + 15;

  const task: Task = {
    id: `TSK-${crypto.randomUUID().slice(0, 6).toUpperCase()}`,
    reportId: report.id,
    assignedTeam: team,
    actionType: action,
    status: 'dispatched',
    eta: `${etaMinutes} min`,
    createdAt: new Date(),
  };

  logs.push(createLog('dispatch', `Task ${task.id} assigned to ${team}`, `ETA: ${task.eta}`));
  return { task, logs };
}

// Feedback Agent: re-evaluate
export function runFeedbackAgent(reports: DisasterReport[], tasks: Task[]): AgentLog[] {
  const logs: AgentLog[] = [];
  const activeCount = tasks.filter(t => t.status === 'dispatched' || t.status === 'active').length;
  const criticalCount = reports.filter(r => r.urgency === 'critical' && r.verificationStatus === 'verified').length;

  if (criticalCount > 3) {
    logs.push(createLog('feedback', 'ALERT: Multiple critical incidents detected', `${criticalCount} critical reports active — escalating resource allocation`));
  }
  if (activeCount > 5) {
    logs.push(createLog('feedback', 'Resource rebalancing initiated', `${activeCount} active tasks — optimizing team assignments`));
  }
  logs.push(createLog('feedback', 'System re-evaluation complete', `${reports.length} reports, ${tasks.length} tasks monitored`));

  return logs;
}

// Full pipeline
export function runAgentPipeline(
  newReport: DisasterReport,
  existingReports: DisasterReport[],
  existingTasks: Task[]
): { report: DisasterReport; task: Task | null; logs: AgentLog[] } {
  let allLogs: AgentLog[] = [];

  const { report: r1, logs: l1 } = runIngestionAgent(newReport);
  allLogs = [...allLogs, ...l1];

  const { report: r2, logs: l2 } = runVerificationAgent(r1, existingReports);
  allLogs = [...allLogs, ...l2];

  if (r2.verificationStatus !== 'verified') {
    return { report: r2, task: null, logs: allLogs };
  }

  const { report: r3, action, logs: l3 } = runDecisionAgent(r2);
  allLogs = [...allLogs, ...l3];

  const { task, logs: l4 } = runDispatchAgent(r3, action);
  allLogs = [...allLogs, ...l4];

  const feedbackLogs = runFeedbackAgent([...existingReports, r3], [...existingTasks, task]);
  allLogs = [...allLogs, ...feedbackLogs];

  return { report: r3, task, logs: allLogs };
}
