// components/types.ts

export interface Comment {
    id: number;
    content: string;
    writer: string;
    createdAt: string;
  }
  
  export interface CommentsResponse {
    currentPage: number;
    totalPages: number;
    comments: Comment[];
  }
  