import DefaultTheme from 'vitepress/theme'
import LifecycleDemo from '../components/LifecycleDemo.vue'
import type { Theme } from 'vitepress'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('LifecycleDemo', LifecycleDemo)
  }
} satisfies Theme
