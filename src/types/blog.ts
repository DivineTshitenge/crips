export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  publishedAt: string;
  author: string;
  authorAvatar: string;
  /** Corps de l’article (paragraphes séparés par une ligne vide) */
  content?: string;
};
