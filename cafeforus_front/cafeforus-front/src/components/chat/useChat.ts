import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/useAuth';
import { useNavigate } from 'react-router-dom';

interface ChatHistoryEntry {
    username: string;
    lastMessage: string;
}

interface ChatHistoryResponse {
    users: ChatHistoryEntry[];
}

interface MessageHistoryEntry {
    id: number;
    sender: string;
    receiver: string;
    content: string;
}

interface MessageHistoryResponse {
    messages: MessageHistoryEntry[];
}

export function useChat() {
    const [activeUser, setActiveUser] = useState<string | null>(null);
    const [chatHistory, setChatHistory] = useState<ChatHistoryEntry[]>([]);
    const [messageHistory, setMessageHistory] = useState<MessageHistoryEntry[]>([]);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            alert('로그인되지 않았습니다. 잠시 후 다시 시도해주세요.');
            navigate('/');
        }
    }, [user, navigate]);

    const username = user?.username;

    // 🛡️ user 없으면 초기값만 반환
    if (!user) {
        return {
            activeUser,
            chatHistory,
            messageHistory,
            startChatWithUser: async () => false,
            setActiveUser,
            sendMessage: async () => {},
        };
    }

    // ✅ 유저 존재 확인
    const checkUserExists = async (username: string): Promise<boolean> => {
        if (username.trim() === '') return false;
        try {
            const response = await fetch(`/api/chat/user-exists/${username}`);
            if (!response.ok) return false;
            const exists = await response.json();
            return exists;
        } catch (error) {
            console.error('유저 확인 오류:', error);
            return false;
        }
    };

    // ✅ 채팅 시작
    const startChatWithUser = async (targetUsername: string) => {
        if (targetUsername === username) {
            alert('자기 자신과 채팅할 수 없습니다.');
            return false;
        }

        const exists = await checkUserExists(targetUsername);
        if (!exists) return false;

        // ✨ 이미 activeUser면 무의미한 요청 방지
        if (targetUsername !== activeUser) {
            setActiveUser(targetUsername);
            await loadMessages(targetUsername);
        }

        // ✨ 중복 방지
        setChatHistory((prev) => {
            const exists = prev.some((entry) => entry.username === targetUsername);
            return exists ? prev : [{ username: targetUsername, lastMessage: '' }, ...prev];
        });

        return true;
    };

    // ✅ 채팅 목록 불러오기
    const loadChatHistory = useCallback(async () => {
        try {
            const response = await fetch(`/api/chat/history/${username}`);
            const data: ChatHistoryResponse = await response.json();
            setChatHistory(data.users);
        } catch (error) {
            console.error('채팅 기록 로드 실패:', error);
        }
    }, [username]);

    // ✅ 메시지 로드
    const loadMessages = async (partner: string) => {
        try {
            const response = await fetch(`/api/chat/messages/${username}/${partner}`);
            if (!response.ok) throw new Error('메시지 로드 실패');
            const data: MessageHistoryResponse = await response.json();
            setMessageHistory(data.messages);
        } catch (error) {
            console.error('메시지 불러오기 실패:', error);
        }
    };

    // ✅ 메시지 전송
    const sendMessage = async (message: string) => {
        if (!activeUser) return;

        try {
            const response = await fetch('/api/chat/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sender: username,
                    receiver: activeUser,
                    message,
                }),
            });

            if (!response.ok) throw new Error('메시지 전송 실패');

            // ✨ 전송 성공 시 메시지 재로드
            await loadMessages(activeUser);
        } catch (error) {
            console.error('메시지 전송 실패:', error);
        }
    };

    // ✅ 초기에 채팅 기록 로드
    useEffect(() => {
        if (username) {
            loadChatHistory();
        }
    }, [loadChatHistory]);

    return {
        activeUser,
        chatHistory,
        messageHistory,
        startChatWithUser,
        setActiveUser,
        sendMessage,
    };
}
