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

  export interface Participant {
    id: number;
    username: string;
  }
  
  export interface ChatRoom {
    id: number;
    name: string;
    type: 'ONE_TO_ONE' | 'GROUP';
    participants: Participant[];  // 참가자를 {id, username} 형태로 관리
  }
  
  export interface ChatMessage {
    messageId: number;
    senderId: number;
    content: string;
    sentAt: string;
  }

  export interface AuthUser {
    id: number;
    username: string;
    level: string;
  }

  export interface Category {
    id: number;
    name: string;
    postCount?: number; // 선택적 필드
    minReadLevel: string;
    minWriteLevel: string;
  }

  export interface Post {
    id: number;
    title: string;
    author: string;
    view: number;
    commentCount: number;
  }

  export interface User {
    id: number;
    username: string;
    email: string;
    level: string;
    role: string;
    postCount: number;
    commentCount: number;
  }