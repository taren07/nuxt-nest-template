import { defineStore } from 'pinia'
import type { User, CreateUserRequest, UpdateUserRequest } from '~/composables/useApi'

export const useUserStore = defineStore('user', () => {
  const users = ref<User[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const { getUsers, createUser: apiCreateUser, updateUser: apiUpdateUser, deleteUser: apiDeleteUser } = useApi()
  const loadingStore = useLoadingStore()

  const fetchUsers = async () => {
    loading.value = true
    error.value = null
    try {
      users.value = await getUsers()
    } catch (err: any) {
      error.value = 'Failed to fetch users'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  const createUser = async (userData: CreateUserRequest) => {
    error.value = null
    try {
      const newUser = await apiCreateUser(userData)
      users.value.push(newUser)
      return newUser
    } catch (err: any) {
      error.value = 'Failed to create user'
      console.error(err)
      throw err
    }
  }

  const updateUser = async (id: number, userData: UpdateUserRequest) => {
    error.value = null
    try {
      const updatedUser = await apiUpdateUser(id, userData)
      const index = users.value.findIndex(user => user.id === id)
      if (index !== -1) {
        users.value[index] = updatedUser
      }
      return updatedUser
    } catch (err: any) {
      error.value = 'Failed to update user'
      console.error(err)
      throw err
    }
  }

  const deleteUser = async (id: number) => {
    error.value = null
    try {
      await apiDeleteUser(id)
      users.value = users.value.filter(user => user.id !== id)
    } catch (err: any) {
      error.value = 'Failed to delete user'
      console.error(err)
      throw err
    }
  }

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser
  }
})