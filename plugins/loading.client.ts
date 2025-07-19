export default defineNuxtPlugin(() => {
  const loadingStore = useLoadingStore()
  const router = useRouter()

  // ページ遷移開始時のローディング
  router.beforeEach((to, from) => {
    if (to.path !== from.path) {
      loadingStore.showLoading('Loading page...')
    }
  })

  // ページ遷移完了時のローディング終了
  router.afterEach(() => {
    // 少し遅延を入れてスムーズな体験を提供
    setTimeout(() => {
      loadingStore.hideLoading()
    }, 300)
  })

  // エラー時のローディング終了
  router.onError(() => {
    loadingStore.forceHideLoading()
  })
})