import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Lithophane Lamp Custom',
    price: 1200,
    originalPrice: 1500,
    category: 'Lighting',
    isCustomizable: true,
    description: 'A bespoke 3D printed lamp that reveals your memory when lit.',
    longDescription: 'Crafted with precision using high-grade PLA filament, our signature Lithophane Lamp transforms your cherished digital memories into a tangible, glowing masterpiece. When turned off, it appears as a textured white sculpture. When lit, the varying thickness of the 3D print reveals your photo in stunning high-definition grayscale detail. Includes a wooden base and warm-white LED integration.',
    features: ['Custom 3D Print from your photo', 'Warm LED Warm Backlight', 'Premium Oak Wood Base', 'USB Powered'],
    images: [
      '/main.png',
      '/Post_3.png',
      '/Process.png',
      '/On-Off.png'
    ]
  },
  /* 
  {
    id: 'p2',
    name: 'Geometric Vase (Obsidian)',
    price: 85.00,
    category: 'Decor',
    isCustomizable: false,
    description: 'Minimalist vase with complex geometric overhangs.',
    longDescription: 'This vase pushes the boundaries of FDM 3D printing, featuring aggressive overhangs and a matte black finish that absorbs light, making it a striking centerpiece for any modern home. Watertight and durable.',
    features: ['Matte Black Finish', 'Watertight', 'Complex Geometry', 'Eco-friendly PLA+'],
    images: [
      'https://picsum.photos/id/1060/800/800',
      'https://picsum.photos/id/106/800/800'
    ]
  },
  {
    id: 'p3',
    name: 'Topographic Desk Organizer',
    price: 65.00,
    category: 'Office',
    isCustomizable: false,
    description: 'Keep your workspace tidy with a landscape-inspired tray.',
    longDescription: 'Inspired by the rolling hills of the Swiss Alps, this desk organizer features varied elevations to hold pens, keys, and accessories. A functional piece of art for the discerning professional.',
    features: ['Topographic Design', 'Weighted Base', 'Soft-touch Finish'],
    images: [
      'https://picsum.photos/id/366/800/800',
      'https://picsum.photos/id/367/800/800'
    ]
  },
  {
    id: 'p4',
    name: 'Voronoi Wall Art',
    price: 210.00,
    category: 'Art',
    isCustomizable: false,
    description: 'Generative design wall piece.',
    longDescription: 'A large-format wall sculpture created using Voronoi algorithms. Each cell is unique, creating a play of shadow and light on your wall.',
    features: ['Wall Mount Included', 'Lightweight Structure', 'Generative Art'],
    images: [
      'https://picsum.photos/id/231/800/800',
      'https://picsum.photos/id/232/800/800'
    ]
  }
  */
];

export const CORE_VALUES = [
  { title: 'Premium Quality', desc: 'Museum-grade materials and finishing.' },
  { title: 'Customer Centric', desc: 'We build relationships, not just products.' },
  { title: 'Bespoke Design', desc: 'Truly unique items, crafted just for you.' },
  { title: 'Sustainable', desc: 'Biodegradable materials and zero-waste manufacturing.' }
];
