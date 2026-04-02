import { Competitor, Notification } from './types';

export const THEME_COLORS = {
  background: '#0A0F1F',
  primary: '#3B82F6', // Blue
  secondary: '#06B6D4', // Cyan
  accent: '#FACC15', // Yellow
  navy: '#1E3A8A',
  card: 'rgba(255, 255, 255, 0.05)',
  border: 'rgba(255, 255, 255, 0.1)',
};

export const INITIAL_COMPETITORS: Competitor[] = [
  {
    id: '1',
    name: "Slack",
    domain: "slack.com",
    status: "Active",
    logo: "https://picsum.photos/seed/slack/100",
    description: "Team communication platform with strong enterprise presence and extensive integrations.",
    tags: ["Real-time messaging", "File sharing", "Integrations"],
    lastUpdated: "2024-07-15",
  },
  {
    id: '2',
    name: "Microsoft Teams",
    domain: "teams.microsoft.com",
    status: "Active",
    logo: "https://picsum.photos/seed/teams/100",
    description: "Integrated with Office 365, strong in the enterprise market for collaboration.",
    tags: ["Video conferencing", "Document collaboration", "Whiteboard"],
    lastUpdated: "2024-07-14",
  },
  {
    id: '3',
    name: "Discord",
    domain: "discord.com",
    status: "Active",
    logo: "https://picsum.photos/seed/discord/100",
    description: "Popular among gaming communities, expanding into general-purpose communication.",
    tags: ["Voice channels", "Community building", "Streaming"],
    lastUpdated: "2024-07-12",
  },
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'launch',
    competitorName: 'Microsoft Teams',
    competitorLogo: 'https://picsum.photos/seed/teams/100',
    title: 'New Feature: AI-Powered Meeting Summaries',
    description: 'Microsoft Teams has launched a new feature that automatically generates meeting summaries, action items, and key highlights using AI.',
    timestamp: '2024-07-21T10:00:00Z',
    read: false,
  },
  {
    id: '2',
    type: 'pricing',
    competitorName: 'Slack',
    competitorLogo: 'https://picsum.photos/seed/slack/100',
    title: 'Pricing Update for Pro Plan',
    description: 'Slack has announced a price increase of 10% for its Pro plan, effective September 1, 2024. This change aims to fund further development in AI and integrations.',
    timestamp: '2024-07-20T14:30:00Z',
    read: false,
  },
  {
    id: '3',
    type: 'feature',
    competitorName: 'Discord',
    competitorLogo: 'https://picsum.photos/seed/discord/100',
    title: 'Community Moderation Tools Beta',
    description: 'Discord is now testing new community moderation tools, including automated content filtering and user reputation scores, to a select group of servers.',
    timestamp: '2024-07-19T09:15:00Z',
    read: true,
  },
  {
    id: '4',
    type: 'funding',
    competitorName: 'Notion',
    competitorLogo: 'https://picsum.photos/seed/notion/100',
    title: 'Raised $50M in Series D Funding',
    description: 'Notion has successfully closed a $50 million Series D funding round led by Future Ventures, valuing the company at $12 billion. Funds will be used for enterprise expansion.',
    timestamp: '2024-07-18T18:00:00Z',
    read: true,
  },
];
