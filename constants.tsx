
import { Project, SiteSettings, Category } from './types';

export const INITIAL_PROJECTS: Project[] = [];

export const DEFAULT_SETTINGS: SiteSettings = {
  designerName: 'Arpan Khatua',
  heroHeading: 'Graphic Design Portfolio',
  heroSubtext: 'Crafting visual stories through strategic branding, minimalist aesthetic, and premium design principles.',
  heroViewWorkText: 'View My Work',
  heroContactText: 'Get In Touch',
  aboutHeading: 'I turn ideas into impactful visual realities.',
  aboutText: "I'm a creative and motivated graphic designer with a strong passion for visual storytelling and brand design. I thrive on exploring new challenges and opportunities that push the boundaries of my creativity.",
  aboutImageUrl: '', // User will upload their own image
  contactHeading: 'Send Me a Message.',
  contactSubtext: "Got a vision? Let's make it real. I'm currently available for freelance work and full-time opportunities.",
  contactEmail: 'arpan.creative@gmail.com',
  skills: ['Thumbnail Design', 'Logo Design', 'Branding', 'UI/UX Design', 'Social Media', 'Illustration'],
  socialLinks: {
    instagram: '#',
    x: '#',
    discord: '#',
    linkedin: '#'
  },
  footerText: 'Thanks For Scrolling!',
  footerCopyright: '© 2024 Arpan Khatua. All Rights Reserved.',
  stats: [
    { label: 'Project Completed', value: '150+' },
    { label: 'Happy Clients', value: '98%' },
    { label: 'Years Experience', value: '04+' },
    { label: 'Design Awards', value: '12' },
  ],
  services: [
    { id: 's1', number: '01', title: 'Thumbnail Design', description: 'Creating high-CTR visuals for YouTube and social media content.' },
    { id: 's2', number: '02', title: 'Logo Design', description: 'Crafting unique visual identifiers that capture brand essence.' },
    { id: 's3', number: '03', title: 'Branding Design', description: 'Comprehensive visual systems and brand guidelines.' },
    { id: 's4', number: '04', title: 'Social Media', description: 'Engaging content optimized for modern social platforms.' },
    { id: 's5', number: '05', title: 'Packaging Design', description: 'Tactile, functional, and beautiful product wrapping.' },
    { id: 's6', number: '06', title: 'UI/UX Design', description: 'Intuitive digital experiences focused on user delight.' },
  ]
};

export const CATEGORIES: Category[] = [
  'Thumbnail', 'Logo Design', 'Branding', 'Social Media', 'Packaging', 'UI/UX'
];
