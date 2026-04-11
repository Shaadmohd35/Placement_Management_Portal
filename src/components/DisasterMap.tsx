import { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { DisasterReport } from '@/types/disaster';
import 'leaflet/dist/leaflet.css';

const urgencyColors = {
  critical: '#EF4444',
  high: '#FACC15',
  medium: '#00C2FF',
  low: '#6B7280',
};

function MapUpdater({ reports }: { reports: DisasterReport[] }) {
  const map = useMap();
  useEffect(() => {
    if (reports.length > 0) {
      const latest = reports[0];
      map.setView([latest.location.lat, latest.location.lng], map.getZoom(), { animate: true });
    }
  }, [reports.length]);
  return null;
}

interface Props {
  reports: DisasterReport[];
}

export function DisasterMap({ reports }: Props) {
  const verified = reports.filter(r => r.verificationStatus === 'verified');

  return (
    <div className="glass rounded-lg overflow-hidden h-full relative">
      <div className="absolute top-3 left-3 z-[1000] flex items-center gap-4 glass-strong rounded px-3 py-1.5">
        <span className="font-heading text-[10px] tracking-wider text-primary">GLOBAL THREAT MAP</span>
        <div className="flex gap-3">
          {Object.entries(urgencyColors).map(([key, color]) => (
            <div key={key} className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-[9px] text-muted-foreground uppercase">{key}</span>
            </div>
          ))}
        </div>
      </div>
      <MapContainer
        center={[20, 0]}
        zoom={2}
        className="h-full w-full"
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapUpdater reports={verified} />
        {verified.map(report => (
          <CircleMarker
            key={report.id}
            center={[report.location.lat, report.location.lng]}
            radius={report.urgency === 'critical' ? 12 : report.urgency === 'high' ? 9 : 6}
            pathOptions={{
              color: urgencyColors[report.urgency],
              fillColor: urgencyColors[report.urgency],
              fillOpacity: 0.4,
              weight: 2,
            }}
          >
            <Popup>
              <div className="font-body text-xs p-1">
                <p className="font-bold">{report.id} — {report.disasterType.toUpperCase()}</p>
                <p>{report.location.name}</p>
                <p>Affected: {report.peopleAffected.toLocaleString()}</p>
                <p>Urgency: {report.urgency} | Confidence: {report.confidenceScore.toFixed(2)}</p>
                <p className="text-muted-foreground mt-1">{report.description}</p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
