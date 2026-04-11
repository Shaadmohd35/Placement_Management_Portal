import { Map, LayoutDashboard, ClipboardList, Radio, Settings } from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: Map, label: 'Map' },
  { icon: ClipboardList, label: 'Tasks' },
  { icon: Radio, label: 'Agents' },
  { icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  return (
    <aside className="glass-strong w-16 flex flex-col items-center py-4 gap-2 border-r border-border/50">
      {navItems.map(({ icon: Icon, label, active }) => (
        <button
          key={label}
          title={label}
          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
            active
              ? 'bg-primary/10 text-primary glow-primary'
              : 'text-muted-foreground hover:text-foreground hover:bg-accent'
          }`}
        >
          <Icon className="w-5 h-5" />
        </button>
      ))}
    </aside>
  );
}
