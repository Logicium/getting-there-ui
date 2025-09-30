// Video data
export interface VideoData {
  id: string;
  title: string;
  presenter: string;
  description: string;
  fullDescription: string;
  duration: string;
  category: string[];
  views: string;
  isFree: boolean;
  tags: string[];
}

export const videos: Record<string, VideoData> = {
  'choosing-happiness': {
    id: 'choosing-happiness',
    title: 'Choosing Happiness: A Daily Practice',
    presenter: 'Dr. Sarah Mitchell',
    description: 'Learn practical strategies for cultivating happiness and maintaining a positive mindset even during challenging times.',
    fullDescription: 'Learn practical strategies for cultivating happiness and maintaining a positive mindset even during challenging times. This presentation covers the neuroscience of happiness and actionable daily practices you can implement today to improve your overall well-being and life satisfaction.',
    duration: '18:32',
    category: ['wellness', 'motivation'],
    views: '3.2K',
    isFree: true,
    tags: ['mindset', 'positive thinking', 'happiness', 'well-being']
  },
  'goal-setting-basics': {
    id: 'goal-setting-basics',
    title: 'Goal Setting Fundamentals',
    presenter: 'Michael Chen',
    description: 'Master the basics of effective goal setting with this comprehensive introduction. Learn the SMART framework and discover how to create goals that actually drive results.',
    fullDescription: 'Master the basics of effective goal setting with this comprehensive introduction. Learn the SMART framework and discover how to create goals that actually drive results. Perfect for beginners or anyone looking to refine their approach to goal achievement.',
    duration: '25:18',
    category: ['productivity', 'motivation'],
    views: '5.1K',
    isFree: true,
    tags: ['smart goals', 'framework', 'planning', 'goal setting']
  },
  'overcoming-procrastination': {
    id: 'overcoming-procrastination',
    title: 'Overcoming Procrastination',
    presenter: 'Lisa Rodriguez',
    description: 'Break free from the procrastination cycle with evidence-based strategies. Understand the psychology behind procrastination and learn practical techniques to take action.',
    fullDescription: 'Break free from the procrastination cycle with evidence-based strategies. Understand the psychology behind procrastination and learn practical techniques to take action, maintain momentum, and build productive habits that stick.',
    duration: '22:45',
    category: ['productivity', 'motivation'],
    views: '4.7K',
    isFree: true,
    tags: ['productivity', 'habits', 'procrastination', 'action taking']
  },
  'coping-with-loss': {
    id: 'coping-with-loss',
    title: 'Coping with Loss: A Path to Healing',
    presenter: 'Dr. Sarah Mitchell',
    description: 'A compassionate and comprehensive guide to navigating grief and loss. This sensitive presentation offers practical tools for healing and finding meaning during difficult times.',
    fullDescription: 'A compassionate and comprehensive guide to navigating grief and loss. This sensitive presentation offers practical tools for healing, processing emotions, and finding meaning during difficult times. Includes trauma-informed approaches and resources for additional support.',
    duration: '45:20',
    category: ['wellness', 'therapy'],
    views: '1.8K',
    isFree: true,
    tags: ['grief', 'healing', 'emotional wellness', 'loss', 'trauma-informed']
  },
  'advanced-goal-setting': {
    id: 'advanced-goal-setting',
    title: 'Advanced Goal Setting Systems',
    presenter: 'Michael Chen',
    description: 'Go beyond basic goal setting with advanced frameworks used by high achievers. Learn systems thinking, goal stacking, and strategic planning methodologies.',
    fullDescription: 'Go beyond basic goal setting with advanced frameworks used by high achievers. Learn systems thinking, goal stacking, and strategic planning methodologies. This comprehensive session covers quarterly planning, habit stacking, and outcome-based measurement systems.',
    duration: '38:15',
    category: ['productivity', 'motivation'],
    views: '2.3K',
    isFree: true,
    tags: ['strategy', 'planning', 'systems', 'advanced techniques', 'goal achievement']
  },
  'building-resilience': {
    id: 'building-resilience',
    title: 'Building Unshakeable Resilience',
    presenter: 'Dr. Sarah Mitchell',
    description: 'Develop mental toughness and emotional resilience to thrive through any challenge. Learn evidence-based techniques for stress management and emotional regulation.',
    fullDescription: 'Develop mental toughness and emotional resilience to thrive through any challenge. Learn evidence-based techniques for stress management, emotional regulation, and post-traumatic growth. This session includes practical exercises for building psychological flexibility and coping skills.',
    duration: '42:08',
    category: ['wellness', 'therapy'],
    views: '1.9K',
    isFree: true,
    tags: ['stress management', 'emotional intelligence', 'resilience', 'coping skills', 'mental health']
  },
  'meaningful-relationships': {
    id: 'meaningful-relationships',
    title: 'Building Meaningful Relationships',
    presenter: 'Dr. Sarah Mitchell',
    description: 'Strengthen your personal and professional relationships with advanced communication skills, conflict resolution, and emotional intelligence techniques.',
    fullDescription: 'Strengthen your personal and professional relationships with advanced communication skills, conflict resolution, and emotional intelligence techniques. Learn active listening, empathy development, and boundary setting for healthier connections.',
    duration: '47:15',
    category: ['wellness', 'therapy'],
    views: '1.7K',
    isFree: true,
    tags: ['relationships', 'communication', 'interpersonal skills', 'emotional intelligence', 'boundaries']
  },
  'mastering-mindfulness': {
    id: 'mastering-mindfulness',
    title: 'Mastering Mindfulness for Success',
    presenter: 'Lisa Rodriguez',
    description: 'A comprehensive guide to using mindfulness and meditation to enhance focus, reduce stress, and improve decision-making for better goal achievement.',
    fullDescription: 'A comprehensive guide to using mindfulness and meditation to enhance focus, reduce stress, and improve decision-making for better goal achievement. Includes guided meditation practices, breath work techniques, and integration strategies for daily life.',
    duration: '55:30',
    category: ['wellness', 'motivation'],
    views: '1.5K',
    isFree: true,
    tags: ['mindfulness', 'meditation', 'focus', 'concentration', 'stress reduction']
  },
  'time-management': {
    id: 'time-management',
    title: 'Elite Time Management Systems',
    presenter: 'Michael Chen',
    description: 'Discover the time management systems used by top performers. Learn advanced scheduling, priority matrix techniques, and energy management strategies.',
    fullDescription: 'Discover the time management systems used by top performers. Learn advanced scheduling techniques, priority matrix methods, energy management strategies, and digital tools for optimal productivity. Includes templates and implementation guides.',
    duration: '33:42',
    category: ['productivity'],
    views: '2.1K',
    isFree: true,
    tags: ['time management', 'productivity systems', 'efficiency', 'scheduling', 'energy management']
  },
  'anxiety-management': {
    id: 'anxiety-management',
    title: 'Managing Anxiety: Practical Techniques for Daily Life',
    presenter: 'Dr. Sarah Mitchell',
    description: 'Learn evidence-based techniques for managing anxiety and stress in daily life. Includes breathing exercises, cognitive strategies, and grounding techniques.',
    fullDescription: 'Learn evidence-based techniques for managing anxiety and stress in daily life. This therapeutic presentation covers breathing exercises, cognitive restructuring, grounding techniques, and practical tools for anxiety management. Includes crisis resources and safety planning.',
    duration: '41:25',
    category: ['wellness', 'therapy'],
    views: '2.8K',
    isFree: true,
    tags: ['anxiety', 'stress management', 'breathing techniques', 'cognitive behavioral therapy', 'mental health']
  },
  'depression-support': {
    id: 'depression-support',
    title: 'Understanding and Supporting Depression Recovery',
    presenter: 'Dr. Sarah Mitchell',
    description: 'A compassionate guide to understanding depression and supporting recovery. Learn about symptoms, treatment options, and self-care strategies.',
    fullDescription: 'A compassionate guide to understanding depression and supporting recovery. This presentation covers symptoms recognition, treatment options, self-care strategies, and how to support loved ones. Includes crisis resources and professional referral information.',
    duration: '52:10',
    category: ['wellness', 'therapy'],
    views: '1.9K',
    isFree: true,
    tags: ['depression', 'mental health', 'recovery', 'self-care', 'support systems']
  },
  'trauma-informed-healing': {
    id: 'trauma-informed-healing',
    title: 'Trauma-Informed Approaches to Healing',
    presenter: 'Dr. Sarah Mitchell',
    description: 'Understanding trauma and its impact on healing. Learn trauma-informed principles and approaches for safe, effective recovery and post-traumatic growth.',
    fullDescription: 'Understanding trauma and its impact on healing processes. This sensitive presentation covers trauma-informed principles, safety planning, grounding techniques, and approaches for post-traumatic growth. Designed with survivor perspectives and includes extensive resources.',
    duration: '48:35',
    category: ['wellness', 'therapy'],
    views: '1.6K',
    isFree: true,
    tags: ['trauma', 'healing', 'post-traumatic growth', 'safety', 'recovery', 'trauma-informed care']
  }
};

// Book data
export interface BookData {
  id: string;
  title: string;
  author: string;
  description: string;
  fullDescription: string;
  specs: Record<string, string>;
  category: string;
  formats: {
    digital: {
      price: number;
      delivery: string;
    };
    print: {
      price: number;
      delivery: string;
    };
  };
  imageUrl?: string;
}

export const books: Record<string, BookData> = {
  'goal-achiever': {
    id: 'goal-achiever',
    title: 'The Goal Achiever\'s Mind: Psychology of Success',
    author: 'Dr. Sarah Mitchell',
    description: 'This groundbreaking book reveals the psychological principles that separate high achievers from dreamers. Dr. Mitchell combines over 20 years of research with practical strategies that have helped thousands of individuals achieve their most ambitious goals.',
    fullDescription: 'Drawing from cutting-edge research in psychology, neuroscience, and behavioral economics, this comprehensive guide provides readers with the mental frameworks needed for sustainable success. Learn how to reprogram your subconscious mind, develop unshakeable confidence, and maintain motivation even when facing setbacks.',
    specs: {
      'Pages': '324',
      'Published': '2023',
      'ISBN': '978-1-234567-89-0',
      'Language': 'English',
      'Category': 'Psychology, Self-Help'
    },
    category: 'bestseller',
    formats: {
      digital: {
        price: 19.99,
        delivery: 'Instant download'
      },
      print: {
        price: 29.99,
        delivery: '3-5 business days'
      }
    }
  },
  'emotional-resilience': {
    id: 'emotional-resilience',
    title: 'Emotional Resilience: Thriving Through Life\'s Challenges',
    author: 'Dr. Sarah Mitchell',
    description: 'Learn to build unshakeable emotional resilience with evidence-based techniques from psychology and neuroscience. Navigate setbacks with grace and emerge stronger from every challenge.',
    fullDescription: 'In this powerful new release, Dr. Mitchell provides readers with a comprehensive toolkit for developing emotional resilience. Based on the latest research in trauma psychology and post-traumatic growth, this book offers practical strategies for not just surviving difficulties, but using them as catalysts for personal growth.',
    specs: {
      'Pages': '298',
      'Published': '2024',
      'ISBN': '978-1-234567-90-6',
      'Language': 'English',
      'Category': 'Psychology, Mental Health'
    },
    category: 'new',
    formats: {
      digital: {
        price: 22.99,
        delivery: 'Instant download'
      },
      print: {
        price: 32.99,
        delivery: '3-5 business days'
      }
    }
  },
  'dreams-reality': {
    id: 'dreams-reality',
    title: 'From Dreams to Reality: The Complete Goal-Setting Guide',
    author: 'Dr. Sarah Mitchell',
    description: 'A step-by-step system for turning your biggest dreams into achievable goals. Includes worksheets, templates, and real-world case studies from successful goal achievers.',
    fullDescription: 'This bestselling guide has helped over 50,000 people transform their lives through effective goal setting. The book includes a complete 12-week program with daily exercises, progress tracking tools, and accountability frameworks. Real-world case studies show how ordinary people achieved extraordinary results.',
    specs: {
      'Pages': '412',
      'Published': '2022',
      'ISBN': '978-1-234567-88-3',
      'Language': 'English',
      'Category': 'Self-Help, Productivity'
    },
    category: 'bestseller',
    formats: {
      digital: {
        price: 24.99,
        delivery: 'Instant download'
      },
      print: {
        price: 34.99,
        delivery: '3-5 business days'
      }
    }
  },
  'mindful-achiever': {
    id: 'mindful-achiever',
    title: 'The Mindful Achiever: Balance and Success',
    author: 'Dr. Sarah Mitchell',
    description: 'Integrate mindfulness practices with goal achievement to create sustainable success without burnout. Learn to maintain balance while pursuing ambitious objectives.',
    fullDescription: 'In our fast-paced world, many high achievers struggle with burnout and loss of meaning. This book shows how to integrate mindfulness practices with ambitious goal pursuit, creating a sustainable path to success that honors both achievement and well-being.',
    specs: {
      'Pages': '276',
      'Published': '2023',
      'ISBN': '978-1-234567-91-3',
      'Language': 'English',
      'Category': 'Mindfulness, Success'
    },
    category: 'psychology',
    formats: {
      digital: {
        price: 21.99,
        delivery: 'Instant download'
      },
      print: {
        price: 31.99,
        delivery: '3-5 business days'
      }
    }
  },
  'breaking-through': {
    id: 'breaking-through',
    title: 'Breaking Through: Overcoming Mental Barriers to Success',
    author: 'Dr. Sarah Mitchell',
    description: 'Identify and overcome the mental barriers that keep you stuck. This practical guide helps you reprogram limiting beliefs and develop an unstoppable mindset.',
    fullDescription: 'Most people are held back not by external circumstances, but by internal mental barriers. This book provides a systematic approach to identifying and dismantling the limiting beliefs, fears, and thought patterns that prevent success. Includes cognitive behavioral techniques and neurolinguistic programming strategies.',
    specs: {
      'Pages': '342',
      'Published': '2023',
      'ISBN': '978-1-234567-92-0',
      'Language': 'English',
      'Category': 'Psychology, Mindset'
    },
    category: 'psychology',
    formats: {
      digital: {
        price: 20.99,
        delivery: 'Instant download'
      },
      print: {
        price: 30.99,
        delivery: '3-5 business days'
      }
    }
  },
  '90-day-transformation': {
    id: '90-day-transformation',
    title: 'The 90-Day Transformation: Rapid Goal Achievement System',
    author: 'Dr. Sarah Mitchell',
    description: 'Achieve significant progress in just 90 days with this intensive goal achievement system. Includes daily exercises, progress tracking tools, and accountability frameworks.',
    fullDescription: 'This intensive program is designed for people who want rapid, measurable progress. Based on the principle that 90 days is the optimal timeframe for creating lasting change, this book provides a day-by-day roadmap for transformation. Includes digital tools and templates.',
    specs: {
      'Pages': '256',
      'Published': '2024',
      'ISBN': '978-1-234567-93-7',
      'Language': 'English',
      'Category': 'Goal Setting, Transformation'
    },
    category: 'new',
    formats: {
      digital: {
        price: 27.99,
        delivery: 'Instant download'
      },
      print: {
        price: 37.99,
        delivery: '3-5 business days'
      }
    }
  }
};

// Filter categories - Updated to remove premium categories and add therapy
export const videoCategories = [
  { id: 'all', label: 'All Videos', icon: '📺' },
  { id: 'wellness', label: 'Mental Wellness', icon: '🧘' },
  { id: 'therapy', label: 'Therapeutic Content', icon: '🩺' },
  { id: 'motivation', label: 'Motivation & Growth', icon: '💪' },
  { id: 'productivity', label: 'Productivity', icon: '🎯' }
];

export const bookCategories = [
  { id: 'all', label: 'All Books', icon: '📚' },
  { id: 'bestseller', label: 'Bestsellers', icon: '⭐' },
  { id: 'new', label: 'New Releases', icon: '🆕' },
  { id: 'psychology', label: 'Psychology', icon: '🧠' },
  { id: 'goals', label: 'Goal Setting', icon: '🎯' }
];

// Blog data
export interface BlogData {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  categoryLabel: string;
  icon: string;
  imageUrl: string;
  date: string;
  readTime: number;
  authorName: string;
  authorCredentials: string;
  authorAvatar: string;
  slug?: string;
  tags?: string[];
}

export const blogArticles: BlogData[] = [
  {
    id: 'anxiety-daily-life',
    title: 'Understanding and Managing Anxiety in Daily Life',
    excerpt: 'Learn practical, evidence-based techniques to recognize anxiety triggers and develop healthy coping strategies that fit into your everyday routine.',
    category: 'anxiety',
    categoryLabel: 'Anxiety Support',
    icon: '🧘‍♀️',
    imageUrl: '/backgrounds/therapy1.jpg',
    date: 'March 15, 2024',
    readTime: 7,
    authorName: 'Dr. Sarah Mitchell',
    authorCredentials: 'Licensed Clinical Psychologist',
    authorAvatar: '👩‍⚕️',
    slug: 'anxiety-daily-life',
    tags:["anxiety","anxiety management","anxiety support","anxiety triggers","coping strategies","daily life","health","healthcare","psychology","therapy"]
  },
  {
    id: 'depression-recovery',
    title: 'Small Steps to Brighter Days: Depression Recovery',
    excerpt: 'Discover gentle, compassionate approaches to depression recovery that honor your pace and celebrate small victories along the way.',
    category: 'depression',
    categoryLabel: 'Depression Care',
    icon: '🌱',
    imageUrl: '/backgrounds/therapy2.jpg',
    date: 'March 12, 2024',
    readTime: 6,
    authorName: 'Dr. Michael Chen',
    authorCredentials: 'Licensed Therapist, LCSW',
    authorAvatar: '👨‍⚕️',
    slug: 'depression-recovery',
    tags:["depression","depression care","depression recovery","health","healthcare","psychology","therapy"]
  },
  {
    id: 'healthy-communication',
    title: 'Building Healthy Communication in Relationships',
    excerpt: 'Learn the essential skills for expressing your needs, setting boundaries, and creating deeper connections with the people who matter most.',
    category: 'relationships',
    categoryLabel: 'Relationships',
    icon: '💕',
    imageUrl: '/backgrounds/brett-jordan-D44kHt8Ex14-unsplash.jpg',
    date: 'March 10, 2024',
    readTime: 8,
    authorName: 'Lisa Rodriguez',
    authorCredentials: 'Marriage & Family Therapist',
    authorAvatar: '👩‍🏫',
    slug: 'healthy-communication',
    tags:["communication","communication skills","health","healthcare","marriage","marriage therapy","relationships","therapy"]
  },
  {
    id: 'mindfulness-busy-lives',
    title: '5-Minute Mindfulness for Busy Lives',
    excerpt: 'Simple mindfulness practices that can be integrated into your daily routine, perfect for those moments when you need to find calm in the chaos.',
    category: 'mindfulness',
    categoryLabel: 'Mindfulness',
    icon: '🧘',
    imageUrl: '/backgrounds/selfcare1.jpg',
    date: 'March 8, 2024',
    readTime: 5,
    authorName: 'Dr. James Wilson',
    authorCredentials: 'Mindfulness-Based Therapist',
    authorAvatar: '👨‍🎓',
    slug: 'mindfulness-busy-lives',
    tags:[""]
  },
  {
    id: 'stress-relief-toolkit',
    title: 'Creating Your Personal Stress Relief Toolkit',
    excerpt: 'Build a personalized collection of stress management techniques that work specifically for your lifestyle, personality, and unique challenges.',
    category: 'stress',
    categoryLabel: 'Stress Management',
    icon: '🌸',
    imageUrl: '/backgrounds/selfcare2.jpg',
    date: 'March 5, 2024',
    readTime: 6,
    authorName: 'Dr. Sarah Mitchell',
    authorCredentials: 'Licensed Clinical Psychologist',
    authorAvatar: '👩‍⚕️',
    slug: 'stress-relief-toolkit',
    tags:["health","healthcare","psychology","stress","stress management","stress relief","therapy"]
  },
  {
    id: 'anxiety-seeking-support',
    title: 'When Worry Becomes Overwhelming: Seeking Support',
    excerpt: 'Understanding when anxiety might need professional support and how to take that important first step toward healing and recovery.',
    category: 'anxiety',
    categoryLabel: 'Anxiety Support',
    icon: '🌊',
    imageUrl: '/backgrounds/therapy3.jpg',
    date: 'March 3, 2024',
    readTime: 7,
    authorName: 'Dr. Michael Chen',
    authorCredentials: 'Licensed Therapist, LCSW',
    authorAvatar: '👨‍⚕️',
    slug: 'anxiety-seeking-support',
    tags:["anxiety","anxiety management","anxiety support","anxiety triggers","coping strategies","health","healthcare","psychology","therapy"]
  }
];

// Event data
export interface EventData {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  location: string;
  time: string;
  capacity: string;
  price: string;
  status: 'available' | 'filling' | 'waitlist';
  icon: string;
  slug?: string;
}

export const events: EventData[] = [
  {
    id: 'anxiety-support',
    title: 'Anxiety Support Circle',
    description: 'A gentle, supportive group environment where you can learn practical anxiety management techniques while connecting with others who understand your journey. Led by licensed therapists in a judgment-free space.',
    category: 'therapy',
    date: 'Every Tuesday, Starting April 15',
    location: 'Denver Wellness Center',
    time: '6:00 PM - 7:30 PM',
    capacity: 'Small group (8-10 participants)',
    price: '$60/session',
    status: 'available',
    icon: '🌱',
    slug: 'anxiety-support'
  },
  {
    id: 'mindful-healing',
    title: 'Mindful Healing Workshop',
    description: 'Learn mindfulness-based stress reduction techniques in a supportive group setting. Perfect for beginners and those seeking deeper practice.',
    category: 'mindfulness',
    date: 'Every Saturday, Starting April 20',
    location: 'Colorado Springs Wellness Center',
    time: '10:00 AM - 12:00 PM',
    capacity: '12 spots available',
    price: '$45/session',
    status: 'available',
    icon: '🧘‍♀️',
    slug: 'mindful-healing'
  },
  {
    id: 'grief-support',
    title: 'Grief & Loss Support Group',
    description: 'A compassionate space for those navigating loss. Share your journey with others who understand, guided by experienced grief counselors.',
    category: 'support',
    date: 'Every Thursday, Starting April 25',
    location: 'Boulder Community Center',
    time: '7:00 PM - 8:30 PM',
    capacity: '6-8 participants (intimate setting)',
    price: '$40/session',
    status: 'available',
    icon: '💔',
    slug: 'grief-support'
  },
  {
    id: 'virtual-depression',
    title: 'Virtual Depression Support Circle',
    description: 'Connect with others from the comfort of your home. A safe, confidential online space for sharing experiences and learning coping strategies.',
    category: 'online',
    date: 'May 2, 2024',
    location: 'Secure Online Platform',
    time: '6:00 PM - 7:30 PM',
    capacity: '3 spots remaining',
    price: '$50/session',
    status: 'filling',
    icon: '💻',
    slug: 'virtual-depression'
  },
  {
    id: 'couples-communication',
    title: 'Couples Communication Workshop',
    description: 'Strengthen your relationship with evidence-based communication techniques. Learn to express needs, resolve conflicts, and deepen intimacy.',
    category: 'therapy',
    date: 'May 10, 2024',
    location: 'Fort Collins Therapy Center',
    time: '1:00 PM - 4:00 PM',
    capacity: '6 couples maximum',
    price: '$120/couple',
    status: 'available',
    icon: '💕',
    slug: 'couples-communication'
  },
  {
    id: 'trauma-recovery',
    title: 'Trauma Recovery Support Group',
    description: 'A gentle, trauma-informed support group for survivors. Focus on healing, resilience, and post-traumatic growth in a safe environment.',
    category: 'support',
    date: 'May 18, 2024',
    location: 'Denver Trauma Center',
    time: '6:00 PM - 7:30 PM',
    capacity: 'Currently full - waitlist available',
    price: '$65/session',
    status: 'waitlist',
    icon: '👥',
    slug: 'trauma-recovery'
  },
  {
    id: 'self-compassion',
    title: 'Self-Compassion & Healing Circle',
    description: 'Learn to treat yourself with the same kindness you\'d offer a good friend. Develop self-compassion practices that promote healing and growth.',
    category: 'mindfulness',
    date: 'May 25, 2024',
    location: 'Pueblo Wellness Center',
    time: '2:00 PM - 4:00 PM',
    capacity: '10 spots available',
    price: '$55/session',
    status: 'available',
    icon: '🌸',
    slug: 'self-compassion'
  }
];

// Hero section data - Updated to reflect all free content
export const heroSections = {
  videos: {
    title: 'Free Healing Resources & Educational Content',
    description: 'Access our complete library of therapeutic presentations, guided sessions, and educational content - all available at no cost to support your mental health journey.',
    stats: [
      { number: '12+', label: 'Therapeutic Videos' },
      { number: '100%', label: 'Free Access' },
      { number: '24/7', label: 'Available' }
    ]
  },
  store: {
    title: 'Dr. Sarah Mitchell\'s Books',
    description: 'Discover transformational insights through our carefully crafted collection of books on goal achievement, personal development, and psychological wellness.',
    authorIntro: 'Dr. Sarah Mitchell (Sue) holds a PhD in Psychology and has over 20 years of experience helping individuals achieve their goals. Her research-based approach combines scientific rigor with practical application, making complex psychological concepts accessible and actionable.'
  }
};
