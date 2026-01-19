import type { Ref } from 'vue';
import { ref, onUnmounted } from 'vue'

interface PollingOptions {
  interval?: number
  immediate?: boolean
}

interface PollingReturn {
  isPolling: Ref<boolean>
  startPolling: () => void
  stopPolling: () => void
  restartPolling: () => void
}

export function usePolling(
  callback: () => void | Promise<void>,
  options: PollingOptions = {}
): PollingReturn {
  const { interval = 5000, immediate = true } = options
  const isPolling = ref(false)
  let timer: NodeJS.Timeout | null = null

  const startPolling = (): void => {
    if (isPolling.value) return

    isPolling.value = true

    if (immediate) {
      void callback()
    }

    timer = setInterval(() => {
      void callback()
    }, interval)
  }

  const stopPolling = (): void => {
    isPolling.value = false
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  const restartPolling = (): void => {
    stopPolling()
    startPolling()
  }

  // Auto cleanup on unmount
  onUnmounted(() => {
    stopPolling()
  })

  return {
    isPolling,
    startPolling,
    stopPolling,
    restartPolling
  }
}
