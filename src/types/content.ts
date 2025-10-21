export interface ContentSection {
  id: string;
  title: string;
  content: string;
  imageURL?: string;
  order: number;
}

export interface HomepageContent {
  heroTitle: string;
  heroSubtitle: string;
  heroImageURL?: string;
  missionTitle: string;
  missionContent: string;
  aboutTitle: string;
  aboutContent: string;
}