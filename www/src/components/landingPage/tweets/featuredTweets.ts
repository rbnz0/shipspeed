export interface Tweet {
  id: string;
  handle: string;
  verified: boolean;
  author: string;
  avatar: string;
  date: Date;
  text: string;
  likes: number;
  retweets: number;
  replies: number;
  quotes: number;
}

export const featuredTweets: Tweet[] = [];
