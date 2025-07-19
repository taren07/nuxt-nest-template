import type { AsyncData } from 'nuxt/app'

export interface User {
  id: number
  email: string
  name: string
  age?: number
  createdAt: string
  updatedAt: string
}

export interface CreateUserRequest {
  email: string
  name: string
  age?: number
}

export interface UpdateUserRequest {
  email?: string
  name?: string
  age?: number
}

const API_BASE_URL = 'http://localhost:3001'

export const useApi = () => {
  const loadingStore = useLoadingStore()

  const apiRequest = async <T>(
    requestFn: () => Promise<T>,
    loadingMessage?: string
  ): Promise<T> => {
    try {
      loadingStore.showLoading(loadingMessage)
      const result = await requestFn()
      return result
    } finally {
      loadingStore.hideLoading()
    }
  }

  const getUsers = (): Promise<User[]> => {
    return apiRequest(
      () => $fetch<User[]>(`${API_BASE_URL}/users`),
      'Loading users...'
    )
  }

  const getUser = (id: number): Promise<User> => {
    return apiRequest(
      () => $fetch<User>(`${API_BASE_URL}/users/${id}`),
      'Loading user details...'
    )
  }

  const createUser = (user: CreateUserRequest): Promise<User> => {
    return apiRequest(
      () => $fetch<User>(`${API_BASE_URL}/users`, {
        method: 'POST',
        body: user
      }),
      'Creating user...'
    )
  }

  const updateUser = (id: number, user: UpdateUserRequest): Promise<User> => {
    return apiRequest(
      () => $fetch<User>(`${API_BASE_URL}/users/${id}`, {
        method: 'PATCH',
        body: user
      }),
      'Updating user...'
    )
  }

  const deleteUser = (id: number): Promise<void> => {
    return apiRequest(
      () => $fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'DELETE'
      }),
      'Deleting user...'
    )
  }

  return {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
  }
}