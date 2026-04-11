import { DisasterReport, DisasterType, UrgencyLevel } from '@/types/disaster';

const locations = [
  { lat: 28.6139, lng: 77.2090, name: 'New Delhi, India' },
  { lat: 19.0760, lng: 72.8777, name: 'Mumbai, India' },
  { lat: 13.0827, lng: 80.2707, name: 'Chennai, India' },
  { lat: 34.0522, lng: -118.2437, name: 'Los Angeles, USA' },
  { lat: 35.6762, lng: 139.6503, name: 'Tokyo, Japan' },
  { lat: 37.7749, lng: -122.4194, name: 'San Francisco, USA' },
  { lat: -23.5505, lng: -46.6333, name: 'São Paulo, Brazil' },
  { lat: 14.5995, lng: 120.9842, name: 'Manila, Philippines' },
  { lat: 39.9042, lng: 116.4074, name: 'Beijing, China' },
  { lat: 51.5074, lng: -0.1278, name: 'London, UK' },
  { lat: 1.3521, lng: 103.8198, name: 'Singapore' },
  { lat: -6.2088, lng: 106.8456, name: 'Jakarta, Indonesia' },
];

const types: DisasterType[] = ['earthquake', 'flood', 'fire', 'hurricane', 'tsunami', 'landslide'];
const urgencies: UrgencyLevel[] = ['critical', 'high', 'medium', 'low'];
const sources: ('twitter' | 'government' | 'manual')[] = ['twitter', 'government', 'manual'];

const descriptions: Record<DisasterType, string[]> = {
  earthquake: ['Magnitude 6.2 earthquake reported', 'Building collapses after tremor', 'Aftershocks felt across region'],
  flood: ['River overflowing into residential area', 'Flash flood warning issued', 'Roads submerged, vehicles stranded'],
  fire: ['Wildfire spreading rapidly', 'Industrial fire, toxic smoke', 'Residential building on fire'],
  hurricane: ['Category 4 hurricane approaching coast', 'Hurricane winds destroying infrastructure', 'Storm surge flooding coastal areas'],
  tsunami: ['Tsunami warning after offshore earthquake', 'Coastal evacuation ordered', 'Waves reaching 10m reported'],
  landslide: ['Hillside collapse after heavy rain', 'Road blocked by landslide', 'Village buried under debris'],
};

let counter = 0;

export function generateReport(): DisasterReport {
  const loc = locations[Math.floor(Math.random() * locations.length)];
  const type = types[Math.floor(Math.random() * types.length)];
  const urgency = urgencies[Math.floor(Math.random() * urgencies.length)];
  const desc = descriptions[type][Math.floor(Math.random() * descriptions[type].length)];
  counter++;

  return {
    id: `RPT-${String(counter).padStart(4, '0')}`,
    location: { ...loc, lat: loc.lat + (Math.random() - 0.5) * 2, lng: loc.lng + (Math.random() - 0.5) * 2 },
    disasterType: type,
    urgency,
    peopleAffected: Math.floor(Math.random() * 5000) + 10,
    confidenceScore: 0,
    verificationStatus: 'pending',
    source: sources[Math.floor(Math.random() * sources.length)],
    description: desc,
    createdAt: new Date(),
  };
}

export const initialReports: DisasterReport[] = Array.from({ length: 8 }, () => {
  const r = generateReport();
  r.confidenceScore = Math.random() * 0.4 + 0.6;
  r.verificationStatus = 'verified';
  r.priority = Math.random();
  return r;
});
