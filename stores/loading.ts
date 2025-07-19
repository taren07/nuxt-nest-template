import { defineStore } from 'pinia'

export const useLoadingStore = defineStore('loading', () => {
  const isLoading = ref(false)
  const message = ref<string>('')
  const requestCount = ref(0)

  const showLoading = (loadingMessage?: string) => {
    requestCount.value++
    isLoading.value = true
    if (loadingMessage) {
      message.value = loadingMessage
    }
  }

  const hideLoading = () => {
    requestCount.value = Math.max(0, requestCount.value - 1)
    if (requestCount.value === 0) {
      isLoading.value = false
      message.value = ''
    }
  }

  const forceHideLoading = () => {
    requestCount.value = 0
    isLoading.value = false
    message.value = ''
  }

  const setMessage = (newMessage: string) => {
    message.value = newMessage
  }

  return {
    isLoading: readonly(isLoading),
    message: readonly(message),
    showLoading,
    hideLoading,
    forceHideLoading,
    setMessage
  }
})