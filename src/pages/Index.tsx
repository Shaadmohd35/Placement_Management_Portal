import { StatusBar } from '@/components/StatusBar';
import { Sidebar } from '@/components/Sidebar';
import { DisasterMap } from '@/components/DisasterMap';
import { IncidentPanel } from '@/components/IncidentPanel';
import { TaskPanel } from '@/components/TaskPanel';
import { AgentActivityFeed } from '@/components/AgentActivityFeed';
import { useDisasterSystem } from '@/hooks/useDisasterSystem';

const Index = () => {
  const { reports, tasks, logs, systemStatus } = useDisasterSystem();

  return (
    <div className="h-screen flex flex-col overflow-hidden grid-bg">
      <StatusBar status={systemStatus} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex flex-col gap-2 p-2 overflow-hidden">
          {/* Top row: Map + Incidents */}
          <div className="flex gap-2 flex-1 min-h-0">
            <div className="flex-[2] min-w-0">
              <DisasterMap reports={reports} />
            </div>
            <div className="flex-1 min-w-0">
              <IncidentPanel reports={reports} />
            </div>
          </div>
          {/* Bottom row: Tasks + Agent Logs */}
          <div className="flex gap-2 h-[280px] shrink-0">
            <div className="flex-1 min-w-0">
              <TaskPanel tasks={tasks} />
            </div>
            <div className="flex-1 min-w-0">
              <AgentActivityFeed logs={logs} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
