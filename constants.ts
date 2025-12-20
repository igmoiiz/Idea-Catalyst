import  { Idea } from './types';

export const COLORS = {
  background_color: "#0C3B2E",
  surface_color: "#6D9773",
  text_color: "#FFFFFF",
  primary_action_color: "#FFBA00",
  secondary_action_color: "#BB8A52",
};

export const SAMPLE_IDEAS: Idea[] = [
  {
    id: 1,
    title: "AI Legal Assistant",
    description: "An AI-powered platform that helps small businesses and individuals navigate legal documents, contracts, and compliance requirements without expensive lawyers.",
    shortDesc: "AI-powered legal document assistant for small businesses.",
    founder: "Sarah Chen",
    avatar: "👩‍💼",
    tags: ["AI", "Legal"],
    likes: 64,
    comments: [
      { author: "Mike R.", text: "This could be huge for startups!" },
      { author: "Lisa K.", text: "How do you handle liability?" }
    ]
  },
  {
    id: 2,
    title: "Eco Delivery Drone",
    description: "Carbon-neutral drone delivery service for urban areas, focusing on last-mile delivery with zero emissions and reduced traffic congestion.",
    shortDesc: "Zero-emission drone delivery for urban last-mile logistics.",
    founder: "James Park",
    avatar: "👨‍🚀",
    tags: ["CleanTech", "Logistics"],
    likes: 52,
    comments: [
      { author: "Anna T.", text: "Love the sustainability angle!" }
    ]
  },
  {
    id: 3,
    title: "HealthTrack AI",
    description: "Personalized health monitoring app using AI to predict potential health issues before they become serious, integrating with wearables and medical records.",
    shortDesc: "AI-powered predictive health monitoring and prevention.",
    founder: "Dr. Priya Sharma",
    avatar: "👩‍⚕️",
    tags: ["AI", "HealthTech"],
    likes: 89,
    comments: [
      { author: "Tom B.", text: "Privacy concerns?" },
      { author: "Emma L.", text: "This could save lives!" }
    ]
  },
  {
    id: 4,
    title: "EduMentor Platform",
    description: "Peer-to-peer learning platform connecting students with mentors in their field of study, featuring AI-matched connections and progress tracking.",
    shortDesc: "AI-matched peer mentoring for students and learners.",
    founder: "Alex Rivera",
    avatar: "👨‍🎓",
    tags: ["EdTech", "AI"],
    likes: 41,
    comments: []
  },
  {
    id: 5,
    title: "FinFlow Analytics",
    description: "Real-time financial analytics dashboard for freelancers and small businesses, with automated invoicing, expense tracking, and tax preparation.",
    shortDesc: "All-in-one financial management for freelancers.",
    founder: "Marcus Lee",
    avatar: "💼",
    tags: ["FinTech", "SaaS"],
    likes: 73,
    comments: [
      { author: "Nina P.", text: "Been waiting for something like this!" }
    ]
  },
  {
    id: 6,
    title: "VR Therapy Sessions",
    description: "Virtual reality platform for mental health therapy, offering immersive environments for anxiety treatment, PTSD therapy, and mindfulness training.",
    shortDesc: "VR-based mental health therapy and mindfulness.",
    founder: "Dr. Kevin Wong",
    avatar: "🧠",
    tags: ["HealthTech", "VR"],
    likes: 58,
    comments: [
      { author: "Rachel M.", text: "Innovative approach to therapy!" }
    ]
  }
];
