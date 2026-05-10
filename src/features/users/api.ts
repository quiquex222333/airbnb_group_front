import { apiClient } from '@/features/auth/api';

export interface CreateUserPayload {
  fullName: string;
}

export interface CreateUserResponse {
  user?: {
    userId: string;
    email?: string;
    fullName?: string;
  };
  message?: string;
}

export const createInternalUser = async (
  payload: CreateUserPayload,
): Promise<CreateUserResponse | null> => {
  try {
    const { data } = await apiClient.post<CreateUserResponse>('/users', payload);
    return data;
  } catch (err: unknown) {
    if (
      typeof err === 'object' &&
      err !== null &&
      'response' in err &&
      (err as { response?: { status?: number } }).response?.status === 409
    ) {
      return null;
    }
    throw err;
  }
};
