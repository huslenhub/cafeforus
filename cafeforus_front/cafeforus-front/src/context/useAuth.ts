import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { loginUser, logoutUser, registerUser, checkLogin } from './authUtils';

export const useAuth = () => {
  const queryClient = useQueryClient();

  // 로그인 상태 확인
  const {
    data: user,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['user'],
    queryFn: checkLogin,
    staleTime: 1000 * 60 * 5, // 5분 캐싱
    retry: false,
  });

  // 로그인
  const loginMutation = useMutation({
    mutationFn: ({ username, password }: { username: string; password: string }) =>
      loginUser(username, password),
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data);
      alert(`로그인 성공! 환영합니다 ${data.username} (권한: ${data.level})`);
    },
    onError: (error: any) => {
      alert(`로그인 실패: ${error.message}`);
    },
  });

  // 로그아웃
  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['user'] });
    },
  });

  // 회원가입
  const registerMutation = useMutation({
    mutationFn: ({ username, password, email }: { username: string; password: string; email: string }) =>
      registerUser(username, password, email),
  });

  return {
    user,
    isLoading,
    isError,
    isAuthenticated: !!user,
    level: user?.level ?? null,
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    refetchUser: refetch,
  };
};
