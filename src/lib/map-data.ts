
export interface MapZone {
  id: string;
  name: string;
  description: string;
  thirstLevel: 'URGENT' | 'NORMAL' | 'LOW' | 'SKIP';
  status: 'Active' | 'Warning' | 'Transitioning' | 'Offline';
  soilMoisture: number;
  temperature: number;
  humidity: number;
  type: string;
  area: string;
  crop: string;
  lastWatered: string;
  nextWatering: string;
}

export const mockMapZones: MapZone[] = [
  {
    id: 'zone-1',
    name: 'Vườn Rau Hữu Cơ',
    description: 'Khu vực trồng rau xanh với hệ thống tưới nhỏ giọt hiện đại',
    thirstLevel: 'NORMAL',
    status: 'Active',
    soilMoisture: 68,
    temperature: 24,
    humidity: 72,
    type: 'vegetable',
    area: '450m²',
    crop: 'Rau cải, Xà lách, Cà chua',
    lastWatered: '2 giờ trước',
    nextWatering: '6 giờ nữa'
  },
  {
    id: 'zone-2',
    name: 'Vườn Cây Ăn Quả',
    description: 'Vườn cây ăn quả lâu năm với bưởi, cam, quýt',
    thirstLevel: 'URGENT',
    status: 'Warning',
    soilMoisture: 23,
    temperature: 26,
    humidity: 45,
    type: 'orchard',
    area: '800m²',
    crop: 'Bưởi Diễn, Cam Vinh, Quýt',
    lastWatered: '3 ngày trước',
    nextWatering: 'Ngay bây giờ'
  },
  {
    id: 'zone-3',
    name: 'Khu Vườn Hoa & Cảnh',
    description: 'Khu vực trồng hoa cảnh và cây cảnh trang trí',
    thirstLevel: 'SKIP',
    status: 'Transitioning',
    soilMoisture: 45,
    temperature: 25,
    humidity: 60,
    type: 'flower',
    area: '320m²',
    crop: 'Hoa hồng, Lavender, Cẩm tú cầu',
    lastWatered: '1 giờ trước',
    nextWatering: 'Đang tưới...'
  },
  {
    id: 'zone-4',
    name: 'Thảm Cỏ & Sân Vườn',
    description: 'Khu vực cỏ xanh và không gian thư giãn ngoài trời',
    thirstLevel: 'LOW',
    status: 'Active',
    soilMoisture: 55,
    temperature: 23,
    humidity: 65,
    type: 'lawn',
    area: '600m²',
    crop: 'Cỏ Bermuda, Cỏ Nhung',
    lastWatered: '5 giờ trước',
    nextWatering: '12 giờ nữa'
  }
];

export const getStatusStyles = (thirstLevel: string, status: string) => {
  if (status === 'Offline') return {
    fill: 'url(#pattern-soil)',
    stroke: '#3f3f46',
    strokeWidth: 2,
    glow: 'none',
    badgeColor: 'bg-zinc-500'
  };
  
  if (thirstLevel === 'URGENT') return {
    fill: 'url(#gradient-urgent)',
    stroke: '#dc2626',
    strokeWidth: 3,
    glow: 'drop-shadow(0 0 12px rgba(220, 38, 38, 0.6))',
    badgeColor: 'bg-red-500'
  };
  
  if (thirstLevel === 'NORMAL') return {
    fill: 'url(#gradient-healthy)',
    stroke: '#16a34a',
    strokeWidth: 2,
    glow: 'drop-shadow(0 0 8px rgba(22, 163, 74, 0.4))',
    badgeColor: 'bg-emerald-500'
  };
  
  if (thirstLevel === 'SKIP') return {
    fill: 'url(#gradient-transition)',
    stroke: '#ea580c',
    strokeWidth: 2,
    glow: 'drop-shadow(0 0 8px rgba(234, 88, 12, 0.4))',
    badgeColor: 'bg-orange-500'
  };
  
  if (thirstLevel === 'LOW') return {
    fill: 'url(#gradient-low)',
    stroke: '#65a30d',
    strokeWidth: 2,
    glow: 'drop-shadow(0 0 6px rgba(101, 163, 13, 0.3))',
    badgeColor: 'bg-lime-500'
  };
  
  return {
    fill: '#27272a',
    stroke: '#52525b',
    strokeWidth: 2,
    glow: 'none',
    badgeColor: 'bg-zinc-500'
  };
};
