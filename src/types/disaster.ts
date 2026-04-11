export type DisasterType = 'earthquake' | 'flood' | 'fire' | 'hurricane' | 'tsunami' | 'landslide';
export type UrgencyLevel = 'critical' | 'high' | 'medium' | 'low';
export type VerificationStatus = 'pending' | 'verified' | 'rejected' | 'duplicate';
export type TaskStatus = 'pending' | 'dispatched' | 'active' | 'completed';
export type ActionType = 'rescue_team' | 'medical_help' | 'food_supply' | 'evacuation' | 'shelter';
export type AgentName = 'ingestion' | 'verification' | 'decision' | 'dispatch' | 'feedback';

export interface DisasterReport {
  id: string;
  location: { lat: number; lng: number; name: string };
  disasterType: DisasterType;
  urgency: UrgencyLevel;
  peopleAffected: number;
  confidenceScore: number;
  verificationStatus: VerificationStatus;
  source: 'twitter' | 'government' | 'manual';
  description: string;
  createdAt: Date;
  priority?: number;
}

export interface Task {
  id: string;
  reportId: string;
  assignedTeam: string;
  actionType: ActionType;
  status: TaskStatus;
  eta: string;
  createdAt: Date;
}

export interface AgentLog {
  id: string;
  agentName: AgentName;
  action: string;
  details?: string;
  timestamp: Date;
}

export interface SystemStatus {
  activeIncidents: number;
  pendingTasks: number;
  activeAgents: number;
  dataStreams: number;
  uptime: string;
  threatLevel: 'green' | 'yellow' | 'orange' | 'red';
}
