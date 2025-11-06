// Event-related TypeScript interfaces

export interface EventStep {
  id: number;
  Name: string;
  starttime: string;
  description: string;
}

export interface EventAbout {
  type: string;
  children: {
    text: string;
    type: string;
  }[];
}

export interface Event {
  id: number;
  documentId: string;
  Title: string;
  Description: string;
  TimeStart: string;
  TimeEnd: string;
  Location: string;
  Address: string | null;
  Frequency: string | null;
  GroupSize: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  about: EventAbout[];
  isFeatured: boolean | null;
  date: string | null;
  Image: any | null;
  steps: EventStep[];
  Price: number | null;
  availabilityStatus: string | null;
}

export interface EventsResponse {
  data: Event[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface HeroSection {
  id: number;
  title: string;
  description: string;
  tag: string | null;
  imagecarousel: null | any;
  image: null | any;
  stats: any[];
}

export interface EventsPageData {
  data: {
    id: number;
    documentId: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    Hero: HeroSection;
  };
  meta: Record<string, any>;
}
