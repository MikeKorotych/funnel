import type { TopicConfig } from './types';
import type { DialogueTree, ScoringRules } from '@/engine/types';

const dialogueTree: DialogueTree = {
  id: 'phone-addiction-v2',
  topicId: 'phone-addiction',
  version: '2.0.0',
  startNodeId: 'welcome',
  nodes: {
    welcome: {
      id: 'welcome',
      type: 'question',
      answerType: 'slider',
      scene: {
        dialogue: 'How many hours a day do you spend on your phone?',
        subtext: 'Drag the slider to your estimate',
        mood: 'neutral',
      },
      sliderConfig: {
        min: 1,
        max: 12,
        step: 1,
        unit: 'h',
        defaultValue: 2,
      },
      xpReward: 35,
      answers: [
        {
          id: 'st-low',
          text: '1-3 hours',
          nextNodeId: 'screen-time-reflection',
          tags: ['low-usage'],
          score: { addiction_severity: 2, awareness: 3 },
        },
        {
          id: 'st-medium',
          text: '4-6 hours',
          nextNodeId: 'screen-time-reflection',
          tags: ['medium-usage'],
          score: { addiction_severity: 5, awareness: 2 },
        },
        {
          id: 'st-high',
          text: '7-9 hours',
          nextNodeId: 'screen-time-reflection',
          tags: ['high-usage'],
          score: { addiction_severity: 8, awareness: 1 },
        },
        {
          id: 'st-extreme',
          text: '10-12 hours',
          nextNodeId: 'screen-time-reflection',
          tags: ['extreme-usage'],
          score: { addiction_severity: 10, awareness: 1 },
        },
      ],
    },

    'screen-time-reflection': {
      id: 'screen-time-reflection',
      type: 'break',
      scene: {
        dialogue: 'In the last five years, your phone has taken more time than it seems.',
        mood: 'concerned',
      },
      nextNodeId: 'primary-trigger',
    },

    'primary-trigger': {
      id: 'primary-trigger',
      type: 'question',
      answerType: 'multi',
      multiSelectConfig: { minSelect: 1, maxSelect: 2 },
      scene: {
        dialogue: 'What pulls you back to your phone the most?',
        subtext: 'Select up to 2 that apply',
        mood: 'concerned',
      },
      xpReward: 30,
      answers: [
        {
          id: 'trig-social',
          text: 'Social media',
          icon: 'ScrollText',
          nextNodeId: 'impact-social',
          tags: ['social-media', 'doom-scrolling'],
          score: { addiction_severity: 3, awareness: 1 },
        },
        {
          id: 'trig-videos',
          text: 'Short videos',
          icon: 'Clapperboard',
          nextNodeId: 'impact-social',
          tags: ['short-video', 'dopamine'],
          score: { addiction_severity: 4, awareness: 1 },
        },
        {
          id: 'trig-messaging',
          text: 'Messaging',
          icon: 'MessageCircle',
          nextNodeId: 'impact-productivity',
          tags: ['messaging', 'fomo'],
          score: { addiction_severity: 2, awareness: 2 },
        },
        {
          id: 'trig-games',
          text: 'Games',
          icon: 'Gamepad2',
          nextNodeId: 'impact-productivity',
          tags: ['gaming', 'escapism'],
          score: { addiction_severity: 3, awareness: 1 },
        },
        {
          id: 'trig-news',
          text: 'News & articles',
          icon: 'Newspaper',
          nextNodeId: 'impact-productivity',
          tags: ['news', 'information-overload'],
          score: { addiction_severity: 2, awareness: 2 },
        },
        {
          id: 'trig-boredom',
          text: 'Just boredom',
          icon: 'Meh',
          nextNodeId: 'impact-social',
          tags: ['boredom', 'habit'],
          score: { addiction_severity: 3, awareness: 1 },
        },
      ],
    },

    'impact-social': {
      id: 'impact-social',
      type: 'question',
      answerType: 'scale',
      scaleConfig: {
        min: 1,
        max: 5,
        minLabel: 'Not at all',
        maxLabel: 'Extremely',
      },
      scene: {
        dialogue: 'How much does scrolling affect your mood and self-image?',
        mood: 'concerned',
      },
      xpReward: 30,
      answers: [
        {
          id: 'imp-s-1',
          text: '1',
          nextNodeId: 'awareness',
          score: { addiction_severity: 1, motivation: 1 },
        },
        {
          id: 'imp-s-2',
          text: '2',
          nextNodeId: 'awareness',
          score: { addiction_severity: 2, motivation: 1 },
        },
        {
          id: 'imp-s-3',
          text: '3',
          nextNodeId: 'awareness',
          score: { addiction_severity: 2, motivation: 2 },
        },
        {
          id: 'imp-s-4',
          text: '4',
          nextNodeId: 'awareness',
          score: { addiction_severity: 3, motivation: 3 },
        },
        {
          id: 'imp-s-5',
          text: '5',
          nextNodeId: 'awareness',
          score: { addiction_severity: 4, motivation: 3 },
        },
      ],
    },

    'impact-productivity': {
      id: 'impact-productivity',
      type: 'question',
      answerType: 'scale',
      scaleConfig: {
        min: 1,
        max: 5,
        minLabel: 'Not at all',
        maxLabel: 'Extremely',
      },
      scene: {
        dialogue:
          'How much does your phone usage disrupt your productivity and daily life?',
        mood: 'concerned',
      },
      xpReward: 30,
      answers: [
        {
          id: 'imp-p-1',
          text: '1',
          nextNodeId: 'awareness',
          score: { addiction_severity: 1, motivation: 1 },
        },
        {
          id: 'imp-p-2',
          text: '2',
          nextNodeId: 'awareness',
          score: { addiction_severity: 2, motivation: 1 },
        },
        {
          id: 'imp-p-3',
          text: '3',
          nextNodeId: 'awareness',
          score: { addiction_severity: 2, motivation: 2 },
        },
        {
          id: 'imp-p-4',
          text: '4',
          nextNodeId: 'awareness',
          score: { addiction_severity: 3, motivation: 3 },
        },
        {
          id: 'imp-p-5',
          text: '5',
          nextNodeId: 'awareness',
          score: { addiction_severity: 4, motivation: 3 },
        },
      ],
    },

    awareness: {
      id: 'awareness',
      type: 'question',
      answerType: 'single',
      scene: {
        dialogue: 'Have you tried to cut down your screen time before?',
        subtext: 'Be honest — this helps us find the right path for you',
        mood: 'encouraging',
      },
      xpReward: 25,
      answers: [
        {
          id: 'aw-failed',
          text: 'Yes, multiple times — always failed',
          icon: 'RotateCcw',
          nextNodeId: 'comparison',
          tags: ['tried-failed', 'cycle'],
          score: { awareness: 4, motivation: 3 },
        },
        {
          id: 'aw-partial',
          text: 'Tried once or twice, some progress',
          icon: 'TrendingDown',
          nextNodeId: 'comparison',
          tags: ['tried-partial'],
          score: { awareness: 3, motivation: 2 },
        },
        {
          id: 'aw-thinking',
          text: "No, but I've been thinking about it",
          icon: 'Lightbulb',
          nextNodeId: 'comparison',
          tags: ['considering'],
          score: { awareness: 2, motivation: 2 },
        },
        {
          id: 'aw-first',
          text: 'This is my first time seeking help',
          icon: 'Sprout',
          nextNodeId: 'comparison',
          tags: ['first-time'],
          score: { awareness: 1, motivation: 4 },
        },
      ],
    },

    comparison: {
      id: 'comparison',
      type: 'break',
      scene: {
        dialogue: 'The research is clear',
        mood: 'encouraging',
      },
      xpReward: 20,
      nextNodeId: 'motivation',
    },

    motivation: {
      id: 'motivation',
      type: 'question',
      answerType: 'multi',
      multiSelectConfig: { minSelect: 1, maxSelect: 2 },
      scene: {
        dialogue: 'What would you do with the time you reclaim?',
        subtext: 'Pick what matters most to you',
        mood: 'encouraging',
      },
      xpReward: 30,
      answers: [
        {
          id: 'mot-focus',
          text: 'Focus on goals',
          icon: 'Target',
          nextNodeId: 'commitment',
          tags: ['goals', 'focus'],
          score: { motivation: 4 },
        },
        {
          id: 'mot-sleep',
          text: 'Better sleep',
          icon: 'Moon',
          nextNodeId: 'commitment',
          tags: ['sleep', 'health'],
          score: { motivation: 3 },
        },
        {
          id: 'mot-people',
          text: 'Be present with loved ones',
          icon: 'Heart',
          nextNodeId: 'commitment',
          tags: ['relationships', 'presence'],
          score: { motivation: 4 },
        },
        {
          id: 'mot-peace',
          text: 'Feel calm and in control',
          icon: 'Leaf',
          nextNodeId: 'commitment',
          tags: ['peace', 'control'],
          score: { motivation: 3 },
        },
      ],
    },

    commitment: {
      id: 'commitment',
      type: 'question',
      answerType: 'single',
      scene: {
        dialogue: 'How committed are you to changing your digital habits?',
        subtext: 'Choose your path, warrior',
        mood: 'dramatic',
      },
      xpReward: 40,
      answers: [
        {
          id: 'com-all-in',
          text: "All in — I'm ready to transform",
          icon: 'Swords',
          nextNodeId: 'loader',
          tags: ['high-commitment'],
          score: { motivation: 5 },
        },
        {
          id: 'com-willing',
          text: 'Willing to try with guidance',
          icon: 'Shield',
          nextNodeId: 'loader',
          tags: ['medium-commitment'],
          score: { motivation: 3 },
        },
        {
          id: 'com-curious',
          text: 'Curious but cautious',
          icon: 'Eye',
          nextNodeId: 'loader',
          tags: ['low-commitment'],
          score: { motivation: 2 },
        },
        {
          id: 'com-help',
          text: 'I need help deciding',
          icon: 'HandHelping',
          nextNodeId: 'loader',
          tags: ['needs-support'],
          score: { motivation: 2 },
        },
      ],
    },

    loader: {
      id: 'loader',
      type: 'loader',
      scene: {
        dialogue: 'Analyzing your digital profile...',
        mood: 'dramatic',
      },
      loaderSteps: [
        { label: 'Mapping your digital habits', durationMs: 1200 },
        { label: 'Identifying trigger patterns', durationMs: 1500 },
        { label: 'Calculating dependency level', durationMs: 1000 },
        { label: 'Generating your personal plan', durationMs: 1800 },
      ],
      nextNodeId: 'result',
    },

    result: {
      id: 'result',
      type: 'result',
      scene: {
        dialogue: 'Your Digital Profile is Ready',
        mood: 'encouraging',
      },
    },
  },
};

const scoringRules: ScoringRules = {
  dimensions: [
    { id: 'addiction_severity', label: 'Screen Dependency', min: 0, max: 24 },
    { id: 'motivation', label: 'Motivation Level', min: 0, max: 18 },
    { id: 'awareness', label: 'Self-Awareness', min: 0, max: 10 },
  ],
  resultTemplates: [
    {
      id: 'severe',
      condition: [
        { dimension: 'addiction_severity', operator: '>=', value: 14 },
      ],
      severity: 'severe',
      title: 'Heavy Digital Dependency',
      description:
        "Your screen habits are significantly impacting your daily life. The good news? You've taken the first step by being here. Your personalized 30-day Digital Detox plan is designed for exactly this level of challenge.",
      planName: 'intensive-digital-detox',
      stats: [
        {
          label: 'Screen Dependency',
          dimension: 'addiction_severity',
          icon: 'Smartphone',
        },
        {
          label: 'Recovery Motivation',
          dimension: 'motivation',
          icon: 'Flame',
          inverted: true,
        },
        {
          label: 'Self-Awareness',
          dimension: 'awareness',
          icon: 'Brain',
          inverted: true,
        },
      ],
    },
    {
      id: 'moderate',
      condition: [
        { dimension: 'addiction_severity', operator: '>=', value: 7 },
      ],
      severity: 'moderate',
      title: 'Moderate Screen Attachment',
      description:
        "You're aware of the problem and have the motivation to change. Your 21-day Digital Balance plan will help you build healthier phone habits without going cold turkey.",
      planName: 'digital-balance',
      stats: [
        {
          label: 'Screen Dependency',
          dimension: 'addiction_severity',
          icon: 'Smartphone',
        },
        {
          label: 'Change Readiness',
          dimension: 'motivation',
          icon: 'Flame',
          inverted: true,
        },
        {
          label: 'Self-Awareness',
          dimension: 'awareness',
          icon: 'Brain',
          inverted: true,
        },
      ],
    },
    {
      id: 'mild',
      condition: [
        { dimension: 'addiction_severity', operator: '>=', value: 0 },
      ],
      severity: 'mild',
      title: 'Early-Stage Screen Habits',
      description:
        "You've caught this early — that's great. Your 14-day Mindful Screen plan will help you build boundaries before habits become harder to break.",
      planName: 'mindful-screen',
      stats: [
        {
          label: 'Screen Tendency',
          dimension: 'addiction_severity',
          icon: 'Smartphone',
        },
        {
          label: 'Motivation',
          dimension: 'motivation',
          icon: 'Flame',
          inverted: true,
        },
        {
          label: 'Awareness',
          dimension: 'awareness',
          icon: 'Brain',
          inverted: true,
        },
      ],
    },
  ],
};

export const phoneAddictionTopic: TopicConfig = {
  id: 'phone-addiction',
  slug: 'phone-addiction',
  name: 'Phone & Social Media Addiction',
  dialogueTree,
  scoringRules,
  saleConfig: {
    headline: 'Your Personal Digital Detox Plan is Ready',
    subheadline:
      "Based on your profile, we've created a day-by-day program to help you reclaim control over your screen time.",
    features: [
      {
        icon: 'ClipboardList',
        text: 'Personalized daily plan based on your habits',
      },
      { icon: 'ShieldBan', text: 'App blocker to eliminate distractions' },
      { icon: 'Timer', text: 'Focus timer for deep work sessions' },
      { icon: 'CircleCheck', text: 'Habit tracker to build new routines' },
      { icon: 'Brain', text: 'Brain training exercises to rewire attention' },
      { icon: 'ChartColumn', text: 'Progress tracking with real stats' },
    ],
    testimonials: [
      {
        name: 'Alex M.',
        text: "I went from 8 hours of screen time to 3. This plan actually works because it's gradual, not cold turkey.",
        rating: 5,
      },
      {
        name: 'Sarah K.',
        text: "The app blocker alone saved me. I didn't realize how much I was opening Instagram on autopilot.",
        rating: 5,
      },
      {
        name: 'James R.',
        text: 'Finally sleeping through the night. No more doom-scrolling at 2 AM.',
        rating: 5,
      },
    ],
    pricing: [
      {
        id: 'annual',
        label: 'Annual',
        price: '$3.99',
        period: '/month',
        originalPrice: '$9.99/month',
        badge: 'Best Value',
        highlighted: true,
      },
      {
        id: 'monthly',
        label: 'Monthly',
        price: '$9.99',
        period: '/month',
      },
    ],
    guarantee: '7-day money-back guarantee. No questions asked.',
    urgencyText: 'Special price available',
  },
  redirectConfig: {
    app: 'wisey',
    iosUrl: 'https://apps.apple.com/app/wisey/id0000000000',
    androidUrl: 'https://play.google.com/store/apps/details?id=com.wisey.app',
    universalLink: 'https://wisey.app/onboard',
    fallbackUrl: 'https://wisey.app',
  },
};
