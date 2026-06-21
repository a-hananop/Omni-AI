import {
  Lightbulb, Wind, Tv, Volume2, Thermometer, Wifi,
  Camera, Coffee, Lock
} from 'lucide-react'

export const INITIAL_DEVICES = [
  { id: 'lights',     name: 'Living Room',  type: 'Lights',   icon: Lightbulb,  color: '#fbbf24', on: true,  brightness: 75 },
  { id: 'bedroom',    name: 'Bedroom',      type: 'Lights',   icon: Lightbulb,  color: '#fbbf24', on: false, brightness: 40 },
  { id: 'ac',         name: 'Bedroom AC',   type: 'Climate',  icon: Wind,       color: '#38bdf8', on: false, temp: 22 },
  { id: 'tv',         name: 'Smart TV',     type: 'Media',    icon: Tv,         color: '#a78bfa', on: true  },
  { id: 'speaker',    name: 'Speaker',      type: 'Audio',    icon: Volume2,    color: '#34d399', on: true,  vol: 40 },
  { id: 'thermostat', name: 'Thermostat',   type: 'Climate',  icon: Thermometer,color: '#f87171', on: true,  temp: 20 },
  { id: 'router',     name: 'Wi-Fi Router', type: 'Network',  icon: Wifi,       color: '#38bdf8', on: true  },
  { id: 'camera',     name: 'Front Door',   type: 'Security', icon: Camera,     color: '#fb923c', on: true  },
  { id: 'coffee',     name: 'Coffee Maker', type: 'Kitchen',  icon: Coffee,     color: '#fbbf24', on: false },
  { id: 'lock',       name: 'Smart Lock',   type: 'Security', icon: Lock,       color: '#34d399', on: true  },
]

export const ENERGY_DATA = [
  { h: '6AM',  kw: 1.2 },
  { h: '8AM',  kw: 2.4 },
  { h: '10AM', kw: 3.1 },
  { h: '12PM', kw: 3.8 },
  { h: '2PM',  kw: 2.9 },
  { h: '4PM',  kw: 3.4 },
  { h: '6PM',  kw: 4.2 },
  { h: '8PM',  kw: 3.5 },
  { h: '10PM', kw: 2.1 },
]
