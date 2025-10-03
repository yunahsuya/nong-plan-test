import { ref, computed, onMounted, onUnmounted } from 'vue'

export function useInfiniteScroll(data, itemsPerLoad = 10) {
  const displayCount = ref(itemsPerLoad)
  const loadMoreTrigger = ref(null)
  let observer = null

  const displayedData = computed(() => {
    return data.value.slice(0, displayCount.value)
  })

  const hasMore = computed(() => {
    return displayCount.value < data.value.length
  })

  function setupIntersectionObserver() {
    if (!loadMoreTrigger.value) return

    observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore.value) {
          loadMore()
        }
      },
      { threshold: 0.1 },
    )

    observer.observe(loadMoreTrigger.value)
  }

  function loadMore() {
    if (!hasMore.value) return
    displayCount.value += itemsPerLoad
  }

  function reset() {
    displayCount.value = itemsPerLoad
  }

  function cleanup() {
    if (observer) {
      observer.disconnect()
    }
  }

  onMounted(() => {
    setupIntersectionObserver()
  })

  onUnmounted(() => {
    cleanup()
  })

  return {
    displayCount,
    displayedData,
    hasMore,
    loadMoreTrigger,
    setupIntersectionObserver,
    reset,
  }
}
