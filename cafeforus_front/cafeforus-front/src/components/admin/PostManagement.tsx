import React, { useState } from "react";
import { Pencil, Trash } from "lucide-react";

interface Post {
  id: number;
  title: string;
  author: string;
  category: string;
  commentCount: number;
  viewCount: number;
  createdAt: string;
}

const posts: Post[] = [
  {
    id: 1,
    title: "첫 글",
    author: "user01",
    category: "공지사항",
    commentCount: 2,
    viewCount: 100,
    createdAt: "2025-04-25",
  },
  {
    id: 2,
    title: "두 번째 글",
    author: "user02",
    category: "자유게시판",
    commentCount: 5,
    viewCount: 250,
    createdAt: "2025-04-26",
  },
];

export default function PostManagement() {
  const [postList, setPostList] = useState(posts);

  const handleDelete = (id: number) => {
    setPostList(postList.filter((post) => post.id !== id));
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">글 관리</h2>
      <div className="overflow-x-auto bg-white border rounded">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">제목</th>
              <th className="p-3">작성자</th>
              <th className="p-3">카테고리</th>
              <th className="p-3">댓글 수</th>
              <th className="p-3">조회수</th>
              <th className="p-3">작성일</th>
              <th className="p-3 text-right">작업</th>
            </tr>
          </thead>
          <tbody>
            {postList.map((post) => (
              <tr key={post.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{post.title}</td>
                <td className="p-3">{post.author}</td>
                <td className="p-3">{post.category}</td>
                <td className="p-3">{post.commentCount}</td>
                <td className="p-3">{post.viewCount}</td>
                <td className="p-3">{post.createdAt}</td>
                <td className="p-3 text-right">
                  <button
                    className="text-gray-500 hover:text-red-500"
                    onClick={() => handleDelete(post.id)}
                  >
                    <Trash size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
