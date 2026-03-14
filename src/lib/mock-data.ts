
export interface Zone {
  id: string;
  name: string;
  type: 'Drip' | 'Sprinkler' | 'Hybrid';
  status: 'Idle' | 'Watering' | 'Offline' | 'Warning';
  soilMoisture: number;
  temperature: number;
  humidity: number;
  pressure: number;
  lastWatered: string;
  thirstLevel: 'URGENT' | 'NORMAL' | 'LOW' | 'SKIP';
  description: string;
}

export const mockZones: Zone[] = [
  {
    id: "zone-1",
    name: "Front Garden",
    type: "Drip",
    status: "Idle",
    soilMoisture: 42,
    temperature: 28,
    humidity: 65,
    pressure: 1.2,
    lastWatered: "2 hours ago",
    thirstLevel: "NORMAL",
    description: "Fruit trees and flower beds requiring low-pressure precision watering."
  },
  {
    id: "zone-2",
    name: "Backyard Orchard",
    type: "Sprinkler",
    status: "Watering",
    soilMoisture: 30,
    temperature: 31,
    humidity: 58,
    pressure: 2.8,
    lastWatered: "Currently Active",
    thirstLevel: "URGENT",
    description: "Open area with fruit trees and ground cover. High pressure required."
  },
  {
    id: "zone-3",
    name: "Vegetable Patch",
    type: "Drip",
    status: "Warning",
    soilMoisture: 15,
    temperature: 33,
    humidity: 45,
    pressure: 0.5,
    lastWatered: "Yesterday",
    thirstLevel: "URGENT",
    description: "Delicate leafy vegetables. Low pressure detected - possible leak."
  },
  {
    id: "zone-4",
    name: "Side Lawn",
    type: "Sprinkler",
    status: "Idle",
    soilMoisture: 75,
    temperature: 26,
    humidity: 70,
    pressure: 0,
    lastWatered: "5 hours ago",
    thirstLevel: "SKIP",
    description: "Main lawn area. Low watering frequency required today."
  }
];

export const mockAlerts = [
  { id: 1, type: "Error", message: "Low pressure detected in Zone 3", time: "10 minutes ago", severity: "high" },
  { id: 2, type: "Warning", message: "High wind speed (6m/s) detected. Sprinkler zones delayed.", time: "45 minutes ago", severity: "medium" },
  { id: 3, type: "Success", message: "Zone 2 watering complete. 120L consumed.", time: "1 hour ago", severity: "low" },
  { id: 4, type: "Info", message: "OTA Update successfully installed on ESP32-Gateway-01", time: "3 hours ago", severity: "low" },
];
