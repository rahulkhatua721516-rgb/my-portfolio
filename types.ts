
export type Category = 'Thumbnail' | 'Logo Design' | 'Branding' | 'Social Media' | 'Packaging' | 'UI/UX';

export interface Project {
  id: string;
  _id?: string;
  title: string;
  description: string;
  category: Category;
  imageUrl: string;
  objectPosition?: string;
  createdAt: number;
}

export interface Service {
  id: string;
  number: string;
  title: string;
  description: string;
}

export interface Stat {
  label: string;
  value: string;
}

export interface SocialLinks {
  instagram: string;
  x: string;
  discord: string;
  linkedin: string;
}

export interface SiteSettings {
  _id?: string;
  designerName: string;
  heroHeading: string;
  heroSubtext: string;
  heroViewWorkText: string;
  heroContactText: string;
  aboutHeading: string;
  aboutText: string;
  aboutImageUrl: string;
  contactHeading: string;
  contactSubtext: string;
  contactEmail: string;
  skills: string[];
  services: Service[];
  stats: Stat[];
  socialLinks: SocialLinks;
  footerText: string;
  footerCopyright: string;
}

export interface Message {
  id: string;
  _id?: string;
  name: string;
  email: string;
  message: string;
  date: number;
}

export interface AdminUser {
  id: string;
  username: string;
  lastLogin: number;
}
