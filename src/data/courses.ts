export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
}

export interface Video {
  id: string
  title: string
  description: string
  duration: string
  videoUrl: string
  thumbnailUrl?: string
}

export interface Quiz {
  id: string
  title: string
  description: string
  questions: QuizQuestion[]
  passingScore: number
}

export interface Chapter {
  id: string
  title: string
  description: string
  content: (Video | Quiz)[]
}

export interface Course {
  id: string
  title: string
  subtitle: string
  description: string
  longDescription: string
  duration: string
  totalLessons: number
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  benefits: string[]
  instructor: {
    name: string
    title: string
    avatar?: string
  }
  introVideo: Video
  thumbnailUrl: string
  chapters: Chapter[]
  finalExam: Quiz
}

export const mockCourses: Course[] = [
  {
    id: 'resilience-mastery',
    title: 'Building Resilience',
    subtitle: 'Master the Art of Bouncing Back',
    description: 'Learn practical techniques to build resilience and thrive in challenging times.',
    longDescription: 'This comprehensive course draws from positive psychology research to help you develop unshakeable resilience. You\'ll learn practical strategies to manage stress, overcome setbacks, and build a mindset that turns challenges into opportunities for growth. Through engaging video lessons and reflective exercises, you\'ll discover how to cultivate inner strength and emotional flexibility.',
    duration: '4 weeks',
    totalLessons: 12,
    level: 'Beginner',
    benefits: [
      'Develop a growth mindset that embraces challenges',
      'Learn science-backed stress management techniques',
      'Build emotional regulation skills',
      'Create personalized resilience practices',
      'Earn a certificate of completion'
    ],
    instructor: {
      name: 'Dr. Sarah Johnson',
      title: 'Clinical Psychologist & Resilience Coach',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop'
    },
    thumbnailUrl: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&h=500&fit=crop',
    introVideo: {
      id: 'resilience-intro',
      title: 'Welcome to Building Resilience',
      description: 'An introduction to the course and what you\'ll learn',
      duration: '3:45',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    chapters: [
      {
        id: 'chapter-1',
        title: 'Understanding Resilience',
        description: 'Learn what resilience is and why it matters',
        content: [
          {
            id: 'video-1-1',
            title: 'What is Resilience?',
            description: 'Explore the science behind resilience and mental toughness',
            duration: '8:30',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            thumbnailUrl: 'https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?w=400&h=250&fit=crop'
          },
          {
            id: 'video-1-2',
            title: 'The Resilience Mindset',
            description: 'Understanding how mindset shapes your response to adversity',
            duration: '10:15',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            thumbnailUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop'
          },
          {
            id: 'quiz-1',
            title: 'Chapter 1 Quiz',
            description: 'Test your understanding of resilience fundamentals',
            questions: [
              {
                id: 'q1-1',
                question: 'What is the primary characteristic of resilience?',
                options: [
                  'Avoiding all difficult situations',
                  'The ability to bounce back from adversity',
                  'Never experiencing negative emotions',
                  'Being the strongest person in the room'
                ],
                correctAnswer: 1
              },
              {
                id: 'q1-2',
                question: 'According to research, resilience is:',
                options: [
                  'A fixed trait you\'re born with',
                  'Only for people who face major trauma',
                  'A skill that can be learned and developed',
                  'Not really important for daily life'
                ],
                correctAnswer: 2
              },
              {
                id: 'q1-3',
                question: 'Which mindset is most associated with resilience?',
                options: [
                  'Fixed mindset',
                  'Growth mindset',
                  'Pessimistic mindset',
                  'Avoidant mindset'
                ],
                correctAnswer: 1
              }
            ],
            passingScore: 2
          }
        ]
      },
      {
        id: 'chapter-2',
        title: 'Building Your Resilience Toolkit',
        description: 'Practical strategies for daily resilience',
        content: [
          {
            id: 'video-2-1',
            title: 'Stress Management Techniques',
            description: 'Practical methods to manage and reduce stress',
            duration: '12:20',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            thumbnailUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=250&fit=crop'
          },
          {
            id: 'video-2-2',
            title: 'Emotional Regulation Skills',
            description: 'Learn to navigate difficult emotions effectively',
            duration: '11:45',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            thumbnailUrl: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400&h=250&fit=crop'
          },
          {
            id: 'quiz-2',
            title: 'Chapter 2 Quiz',
            description: 'Apply your knowledge of resilience strategies',
            questions: [
              {
                id: 'q2-1',
                question: 'Which technique is most effective for immediate stress relief?',
                options: [
                  'Deep breathing exercises',
                  'Planning next week\'s schedule',
                  'Checking social media',
                  'Drinking caffeine'
                ],
                correctAnswer: 0
              },
              {
                id: 'q2-2',
                question: 'Emotional regulation involves:',
                options: [
                  'Suppressing all negative emotions',
                  'Understanding and managing emotions effectively',
                  'Only focusing on positive emotions',
                  'Avoiding situations that cause emotions'
                ],
                correctAnswer: 1
              }
            ],
            passingScore: 2
          }
        ]
      },
      {
        id: 'chapter-3',
        title: 'Sustaining Resilience',
        description: 'Make resilience a lifelong practice',
        content: [
          {
            id: 'video-3-1',
            title: 'Creating Your Personal Resilience Plan',
            description: 'Design a customized resilience practice',
            duration: '9:30',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            thumbnailUrl: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=250&fit=crop'
          },
          {
            id: 'video-3-2',
            title: 'Moving Forward with Confidence',
            description: 'Integrate resilience into your daily life',
            duration: '10:00',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            thumbnailUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop'
          },
          {
            id: 'quiz-3',
            title: 'Chapter 3 Quiz',
            description: 'Demonstrate your resilience planning skills',
            questions: [
              {
                id: 'q3-1',
                question: 'A good resilience plan should be:',
                options: [
                  'The same for everyone',
                  'Personalized to your needs and lifestyle',
                  'Focused only on work situations',
                  'Changed daily'
                ],
                correctAnswer: 1
              },
              {
                id: 'q3-2',
                question: 'To sustain resilience long-term, you should:',
                options: [
                  'Only practice when facing challenges',
                  'Make it a regular part of your routine',
                  'Wait until you feel stressed',
                  'Practice intensively for one month then stop'
                ],
                correctAnswer: 1
              }
            ],
            passingScore: 2
          }
        ]
      }
    ],
    finalExam: {
      id: 'final-exam-resilience',
      title: 'Building Resilience - Final Exam',
      description: 'Demonstrate your mastery of resilience concepts and techniques',
      questions: [
        {
          id: 'final-1',
          question: 'What is the most important first step in building resilience?',
          options: [
            'Avoiding all stressful situations',
            'Developing self-awareness of your current coping strategies',
            'Comparing yourself to others',
            'Waiting for challenges to arise'
          ],
          correctAnswer: 1
        },
        {
          id: 'final-2',
          question: 'Which of the following is a core component of emotional regulation?',
          options: [
            'Ignoring your feelings',
            'Only expressing positive emotions',
            'Recognizing and accepting emotions without judgment',
            'Blaming others for how you feel'
          ],
          correctAnswer: 2
        },
        {
          id: 'final-3',
          question: 'Resilient people typically:',
          options: [
            'Never experience setbacks',
            'View challenges as opportunities for growth',
            'Avoid taking any risks',
            'Rely solely on others for support'
          ],
          correctAnswer: 1
        },
        {
          id: 'final-4',
          question: 'The best time to practice resilience techniques is:',
          options: [
            'Only during major crises',
            'When you remember to do them',
            'Regularly, as part of your daily routine',
            'Only when recommended by others'
          ],
          correctAnswer: 2
        },
        {
          id: 'final-5',
          question: 'A growth mindset in resilience means:',
          options: [
            'Believing your abilities are fixed',
            'Thinking you should never fail',
            'Believing you can develop and improve through effort',
            'Avoiding challenges to protect your self-esteem'
          ],
          correctAnswer: 2
        }
      ],
      passingScore: 4
    }
  },
  {
    id: 'mindfulness-daily',
    title: 'Mindfulness for Daily Life',
    subtitle: 'Cultivate Peace and Presence',
    description: 'Discover how to bring mindfulness into your everyday routine for greater calm and clarity.',
    longDescription: 'In our fast-paced world, mindfulness offers an anchor to the present moment. This course teaches you practical mindfulness techniques that fit seamlessly into your daily life. Whether you have 2 minutes or 20, you\'ll learn how to cultivate awareness, reduce anxiety, and find peace in the midst of a busy day. No meditation cushion or special equipment required—just an openness to explore.',
    duration: '3 weeks',
    totalLessons: 10,
    level: 'Beginner',
    benefits: [
      'Reduce stress and anxiety naturally',
      'Improve focus and concentration',
      'Develop greater emotional balance',
      'Learn meditation techniques for beginners',
      'Earn a certificate of completion'
    ],
    instructor: {
      name: 'Michael Chen',
      title: 'Mindfulness Teacher & Meditation Guide',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop'
    },
    thumbnailUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=500&fit=crop',
    introVideo: {
      id: 'mindfulness-intro',
      title: 'Welcome to Mindfulness for Daily Life',
      description: 'Begin your journey to greater presence and peace',
      duration: '4:15',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    chapters: [
      {
        id: 'chapter-1',
        title: 'Introduction to Mindfulness',
        description: 'Understanding the foundations of mindful living',
        content: [
          {
            id: 'video-1-1',
            title: 'What is Mindfulness?',
            description: 'Explore the essence and benefits of mindfulness practice',
            duration: '9:00',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            thumbnailUrl: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400&h=250&fit=crop'
          },
          {
            id: 'video-1-2',
            title: 'The Science of Mindfulness',
            description: 'Research-backed benefits of mindfulness practice',
            duration: '8:45',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            thumbnailUrl: 'https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?w=400&h=250&fit=crop'
          },
          {
            id: 'quiz-1',
            title: 'Chapter 1 Quiz',
            description: 'Test your understanding of mindfulness basics',
            questions: [
              {
                id: 'q1-1',
                question: 'Mindfulness is best defined as:',
                options: [
                  'Emptying your mind of all thoughts',
                  'Paying attention to the present moment without judgment',
                  'Thinking only positive thoughts',
                  'Avoiding negative emotions'
                ],
                correctAnswer: 1
              },
              {
                id: 'q1-2',
                question: 'Research shows mindfulness can help with:',
                options: [
                  'Only emotional concerns',
                  'Stress, anxiety, focus, and overall well-being',
                  'Nothing measurable',
                  'Only physical health'
                ],
                correctAnswer: 1
              }
            ],
            passingScore: 2
          }
        ]
      },
      {
        id: 'chapter-2',
        title: 'Mindfulness Practices',
        description: 'Learn practical techniques for daily use',
        content: [
          {
            id: 'video-2-1',
            title: 'Mindful Breathing',
            description: 'The foundation of all mindfulness practice',
            duration: '10:30',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            thumbnailUrl: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=400&h=250&fit=crop'
          },
          {
            id: 'video-2-2',
            title: 'Body Scan Meditation',
            description: 'Develop body awareness and relaxation',
            duration: '12:00',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            thumbnailUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=250&fit=crop'
          },
          {
            id: 'quiz-2',
            title: 'Chapter 2 Quiz',
            description: 'Apply your mindfulness knowledge',
            questions: [
              {
                id: 'q2-1',
                question: 'The breath is important in mindfulness because:',
                options: [
                  'It\'s always available as an anchor to the present',
                  'You need to breathe perfectly',
                  'It makes you feel sleepy',
                  'It\'s the only thing you should ever focus on'
                ],
                correctAnswer: 0
              },
              {
                id: 'q2-2',
                question: 'During a body scan, if you notice tension you should:',
                options: [
                  'Ignore it and move on',
                  'Get frustrated with yourself',
                  'Simply acknowledge it without judgment',
                  'Stop the practice immediately'
                ],
                correctAnswer: 2
              }
            ],
            passingScore: 2
          }
        ]
      }
    ],
    finalExam: {
      id: 'final-exam-mindfulness',
      title: 'Mindfulness for Daily Life - Final Exam',
      description: 'Demonstrate your understanding of mindfulness principles and practices',
      questions: [
        {
          id: 'final-1',
          question: 'The core attitude of mindfulness practice is:',
          options: [
            'Judgment and criticism',
            'Non-judgmental awareness',
            'Constant positivity',
            'Detachment from all feelings'
          ],
          correctAnswer: 1
        },
        {
          id: 'final-2',
          question: 'When your mind wanders during meditation, you should:',
          options: [
            'Give up—you\'re not good at meditation',
            'Get angry with yourself',
            'Gently bring your attention back without judgment',
            'Force yourself to concentrate harder'
          ],
          correctAnswer: 2
        },
        {
          id: 'final-3',
          question: 'Mindfulness can be practiced:',
          options: [
            'Only while sitting in meditation',
            'During any daily activity',
            'Only in quiet spaces',
            'Only for 30 minutes at a time'
          ],
          correctAnswer: 1
        },
        {
          id: 'final-4',
          question: 'The breath serves as:',
          options: [
            'Something that must be controlled',
            'An anchor to the present moment',
            'A way to achieve enlightenment',
            'The only focus of mindfulness'
          ],
          correctAnswer: 1
        }
      ],
      passingScore: 3
    }
  },
  {
    id: 'positive-habits',
    title: 'Creating Positive Habits',
    subtitle: 'Transform Your Life One Habit at a Time',
    description: 'Learn the science of habit formation and create lasting positive changes in your life.',
    longDescription: 'Habits shape our lives more than we realize. This course combines insights from behavioral psychology and positive psychology to help you understand how habits form and how to create ones that stick. You\'ll learn to identify triggers, design effective routines, and build a reward system that keeps you motivated. Whether you want to exercise more, eat better, or develop a gratitude practice, this course provides the blueprint for lasting change.',
    duration: '5 weeks',
    totalLessons: 15,
    level: 'Intermediate',
    benefits: [
      'Understand the neuroscience of habit formation',
      'Create a personalized habit-building system',
      'Learn to overcome common obstacles',
      'Build accountability and motivation strategies',
      'Earn a certificate of completion'
    ],
    instructor: {
      name: 'Dr. Emily Rodriguez',
      title: 'Behavioral Psychologist & Habit Coach',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop'
    },
    thumbnailUrl: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=500&fit=crop',
    introVideo: {
      id: 'habits-intro',
      title: 'Welcome to Creating Positive Habits',
      description: 'Start your journey to lasting behavior change',
      duration: '5:00',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    chapters: [
      {
        id: 'chapter-1',
        title: 'The Science of Habits',
        description: 'Understanding how habits work',
        content: [
          {
            id: 'video-1-1',
            title: 'The Habit Loop',
            description: 'Discover the cue-routine-reward cycle',
            duration: '11:00',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            thumbnailUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=250&fit=crop'
          },
          {
            id: 'video-1-2',
            title: 'Why Habits Stick (or Don\'t)',
            description: 'The neuroscience behind habit formation',
            duration: '10:30',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            thumbnailUrl: 'https://images.unsplash.com/photo-1559511260-66a654ae982a?w=400&h=250&fit=crop'
          },
          {
            id: 'quiz-1',
            title: 'Chapter 1 Quiz',
            description: 'Test your knowledge of habit science',
            questions: [
              {
                id: 'q1-1',
                question: 'The habit loop consists of:',
                options: [
                  'Cue, routine, reward',
                  'Thought, action, consequence',
                  'Plan, execute, review',
                  'Desire, action, satisfaction'
                ],
                correctAnswer: 0
              },
              {
                id: 'q1-2',
                question: 'How long does it typically take to form a new habit?',
                options: [
                  'Exactly 21 days',
                  'It varies, often 2-8 months depending on complexity',
                  'One week',
                  'One year'
                ],
                correctAnswer: 1
              },
              {
                id: 'q1-3',
                question: 'Habits are formed in which part of the brain?',
                options: [
                  'Prefrontal cortex only',
                  'Basal ganglia',
                  'Hippocampus',
                  'Amygdala'
                ],
                correctAnswer: 1
              }
            ],
            passingScore: 2
          }
        ]
      },
      {
        id: 'chapter-2',
        title: 'Building Your Habit System',
        description: 'Practical strategies for habit formation',
        content: [
          {
            id: 'video-2-1',
            title: 'Identifying Effective Cues',
            description: 'Choose triggers that work for your lifestyle',
            duration: '9:45',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            thumbnailUrl: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=400&h=250&fit=crop'
          },
          {
            id: 'video-2-2',
            title: 'Designing Rewarding Routines',
            description: 'Make your habits enjoyable and sustainable',
            duration: '11:20',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            thumbnailUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop'
          },
          {
            id: 'video-2-3',
            title: 'Habit Stacking',
            description: 'Build new habits on existing ones',
            duration: '8:30',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            thumbnailUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=250&fit=crop'
          },
          {
            id: 'quiz-2',
            title: 'Chapter 2 Quiz',
            description: 'Apply habit-building strategies',
            questions: [
              {
                id: 'q2-1',
                question: 'A good cue for a morning exercise habit might be:',
                options: [
                  'Whenever you feel motivated',
                  'Placing workout clothes next to your bed',
                  'Waiting for perfect weather',
                  'When someone reminds you'
                ],
                correctAnswer: 1
              },
              {
                id: 'q2-2',
                question: 'Habit stacking means:',
                options: [
                  'Trying to change everything at once',
                  'Linking a new habit to an existing one',
                  'Only doing habits in groups',
                  'Avoiding all old habits'
                ],
                correctAnswer: 1
              }
            ],
            passingScore: 2
          }
        ]
      },
      {
        id: 'chapter-3',
        title: 'Sustaining Long-Term Change',
        description: 'Overcome obstacles and maintain momentum',
        content: [
          {
            id: 'video-3-1',
            title: 'Overcoming Setbacks',
            description: 'Get back on track when you slip up',
            duration: '10:15',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            thumbnailUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop'
          },
          {
            id: 'video-3-2',
            title: 'Building Accountability',
            description: 'Create systems to keep yourself on track',
            duration: '9:00',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            thumbnailUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&h=250&fit=crop'
          },
          {
            id: 'quiz-3',
            title: 'Chapter 3 Quiz',
            description: 'Master long-term habit maintenance',
            questions: [
              {
                id: 'q3-1',
                question: 'When you miss a day of your habit, you should:',
                options: [
                  'Give up—the streak is broken',
                  'Get back on track the next day without self-judgment',
                  'Start completely over from day one',
                  'Double your effort the next day'
                ],
                correctAnswer: 1
              },
              {
                id: 'q3-2',
                question: 'Accountability partners work best when:',
                options: [
                  'They criticize you for failures',
                  'They provide support and check-ins',
                  'You never tell them about setbacks',
                  'They do the habit for you'
                ],
                correctAnswer: 1
              }
            ],
            passingScore: 2
          }
        ]
      }
    ],
    finalExam: {
      id: 'final-exam-habits',
      title: 'Creating Positive Habits - Final Exam',
      description: 'Demonstrate your mastery of habit formation and maintenance',
      questions: [
        {
          id: 'final-1',
          question: 'The most important element of the habit loop is:',
          options: [
            'Willpower',
            'The reward that reinforces the behavior',
            'Motivation',
            'Time of day'
          ],
          correctAnswer: 1
        },
        {
          id: 'final-2',
          question: 'To make a habit stick, you should:',
          options: [
            'Start with huge, ambitious goals',
            'Start small and build gradually',
            'Only do it when you feel motivated',
            'Change everything at once'
          ],
          correctAnswer: 1
        },
        {
          id: 'final-3',
          question: 'Environment design in habit formation means:',
          options: [
            'Moving to a new house',
            'Arranging your space to make good habits easier',
            'Avoiding all triggers',
            'Working in complete isolation'
          ],
          correctAnswer: 1
        },
        {
          id: 'final-4',
          question: 'When facing resistance to a new habit, it\'s best to:',
          options: [
            'Force yourself through it',
            'Give up immediately',
            'Examine barriers and adjust your approach',
            'Blame external circumstances'
          ],
          correctAnswer: 2
        },
        {
          id: 'final-5',
          question: 'Habit stacking is most effective when:',
          options: [
            'You stack 10 new habits at once',
            'You link one new habit to a well-established one',
            'You abandon all old habits',
            'You only stack habits that are unrelated'
          ],
          correctAnswer: 1
        }
      ],
      passingScore: 4
    }
  }
]

// Helper functions
export function getCourseById(id: string): Course | undefined {
  return mockCourses.find(course => course.id === id)
}

export function getChapterById(courseId: string, chapterId: string): Chapter | undefined {
  const course = getCourseById(courseId)
  return course?.chapters.find(chapter => chapter.id === chapterId)
}

export function getContentById(courseId: string, chapterId: string, contentId: string): Video | Quiz | undefined {
  const chapter = getChapterById(courseId, chapterId)
  return chapter?.content.find(item => item.id === contentId)
}

export function isVideo(content: Video | Quiz): content is Video {
  return 'videoUrl' in content
}

export function isQuiz(content: Video | Quiz): content is Quiz {
  return 'questions' in content
}
