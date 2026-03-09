import { ref, onMounted, onUnmounted, defineAsyncComponent, h, type Component } from 'vue'

/**
 * Lazy-load a Vue component when its container becomes visible in the viewport.
 * Uses IntersectionObserver to defer loading until user scrolls near the component.
 *
 * Usage in markdown:
 *   import { useLazyComponent } from '../.vitepress/composables/useLazyComponent'
 *   const LazyDemo = useLazyComponent(() => import('../.vitepress/components/HeavyDemo.vue'))
 *
 * Then use <LazyDemo /> in template — it renders a placeholder div until visible.
 */
export function useLazyComponent(
  loader: () => Promise<{ default: Component }>,
  options: { rootMargin?: string; threshold?: number } = {}
): Component {
  const { rootMargin = '200px', threshold = 0 } = options

  const AsyncComp = defineAsyncComponent(loader)

  return {
    name: 'LazyLoadWrapper',
    setup() {
      const containerRef = ref<HTMLElement | null>(null)
      const isVisible = ref(false)
      let observer: IntersectionObserver | null = null

      onMounted(() => {
        if (!containerRef.value) return

        // If IntersectionObserver is not supported, load immediately
        if (!('IntersectionObserver' in window)) {
          isVisible.value = true
          return
        }

        observer = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting) {
              isVisible.value = true
              observer?.disconnect()
              observer = null
            }
          },
          { rootMargin, threshold }
        )

        observer.observe(containerRef.value)
      })

      onUnmounted(() => {
        observer?.disconnect()
      })

      return () => {
        if (isVisible.value) {
          return h(AsyncComp)
        }
        return h('div', {
          ref: containerRef,
          style: 'min-height: 200px; display: flex; align-items: center; justify-content: center; color: var(--vp-c-text-3); font-size: 0.9em;',
        }, 'Loading...')
      }
    },
  }
}
