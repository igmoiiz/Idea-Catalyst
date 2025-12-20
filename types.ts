export interface Comment {
  author: string;
  text: string;
}

export interface Idea {
  id: number;
  title: string;
  description: string;
  shortDesc: string;
  founder: string;
  avatar: string;
  tags: string[];
  likes: number;
  comments: Comment[];
}

export type ViewState = "home" | "signin" | "signup" | "submitidea" | "explore" | "features";