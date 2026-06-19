// Event-related utility functions

import type { Component } from 'vue';
import {
  Flower,
  Heart,
  HeartCrack,
  Laptop,
  Users,
  Sprout,
  Sun,
  Cherry,
  Leaf,
} from 'lucide-vue-next';

/**
 * Determine event category based on title
 */
export function getCategoryFromTitle(title: string): string {
  const lowerTitle = title.toLowerCase();

  if (lowerTitle.includes('mindful') || lowerTitle.includes('meditation') || lowerTitle.includes('compassion')) {
    return 'mindfulness';
  } else if (lowerTitle.includes('therapy') || lowerTitle.includes('couples') || lowerTitle.includes('communication')) {
    return 'therapy';
  } else if (lowerTitle.includes('support') || lowerTitle.includes('grief') || lowerTitle.includes('loss') || lowerTitle.includes('trauma') || lowerTitle.includes('anxiety') || lowerTitle.includes('depression')) {
    return 'support';
  } else if (lowerTitle.includes('virtual') || lowerTitle.includes('online')) {
    return 'online';
  }

  return 'all';
}

/**
 * Determine appropriate icon component based on event title
 */
export function getEventIcon(title: string): Component {
  const lowerTitle = title.toLowerCase();

  if (lowerTitle.includes('mindful') || lowerTitle.includes('meditation')) {
    return Flower;
  } else if (lowerTitle.includes('couples') || lowerTitle.includes('relationship')) {
    return Heart;
  } else if (lowerTitle.includes('grief') || lowerTitle.includes('loss')) {
    return HeartCrack;
  } else if (lowerTitle.includes('virtual') || lowerTitle.includes('online')) {
    return Laptop;
  } else if (lowerTitle.includes('trauma')) {
    return Users;
  } else if (lowerTitle.includes('anxiety')) {
    return Sprout;
  } else if (lowerTitle.includes('depression')) {
    return Sun;
  } else if (lowerTitle.includes('compassion')) {
    return Cherry;
  }

  return Leaf;
}

/**
 * Sort events by date
 */
export function sortEventsByDate<T extends { date: string | null }>(events: T[]): T[] {
  return [...events].sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : 0;
    const dateB = b.date ? new Date(b.date).getTime() : 0;
    return dateA - dateB;
  });
}
