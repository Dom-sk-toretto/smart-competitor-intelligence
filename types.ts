import React from 'react';

export interface Competitor {
  id: string;
  name: string;
  domain: string;
  status: string;
  logo: string;
  description: string;
  tags: string[];
  lastUpdated: string;
}

export interface ProfileDetails {
  name: string;
  email: string;
  photoUrl: string;
}

export interface CompanyDetails {
  name: string;
  url: string;
}

export interface NavItem {
  text: string;
  link: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface CompetitorAnalysisResult {
  summary: string;
  marketShare: string;
  recentFunding: string;
  productLaunches: string[];
  opportunities: string[];
  threats: string[];
}

export interface ComparisonData {
  table: {
    columns: { id: string; label: string }[];
    rows: { parameter: string; data: string[][] }[];
  };
  charts: {
    pricingBarChart: {
      data: { name: string; price: number }[];
    };
    featuresRadarChart: {
      subjects: { subject: string; max: number }[];
      data: {
        company: string;
        values: { subject: string; value: number }[];
      }[];
    };
  };
}

export interface Notification {
  id: string;
  type: 'launch' | 'pricing' | 'feature' | 'funding';
  competitorName: string;
  competitorLogo: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}

export interface UrlValidationResult {
  isValid: boolean;
  reason: string;
}

export interface SWOTAnalysis {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
}