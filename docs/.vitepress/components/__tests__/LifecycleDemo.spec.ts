import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import LifecycleDemo from '../LifecycleDemo.vue'

describe('LifecycleDemo', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders with initial count of 0', async () => {
    const wrapper = mount(LifecycleDemo)
    await flushPromises()
    expect(wrapper.find('.counter-value').text()).toBe('0')
    expect(wrapper.find('.counter-double').text()).toBe('x2 = 0')
    wrapper.unmount()
  })

  it('increments counter by step value', async () => {
    const wrapper = mount(LifecycleDemo)
    await flushPromises()
    await wrapper.find('[data-testid="increment"]').trigger('click')
    expect(wrapper.find('.counter-value').text()).toBe('1')
    expect(wrapper.find('.counter-double').text()).toBe('x2 = 2')
    wrapper.unmount()
  })

  it('decrements counter by step value', async () => {
    const wrapper = mount(LifecycleDemo)
    await flushPromises()
    await wrapper.find('[data-testid="decrement"]').trigger('click')
    expect(wrapper.find('.counter-value').text()).toBe('-1')
    wrapper.unmount()
  })

  it('resets counter to 0', async () => {
    const wrapper = mount(LifecycleDemo)
    await flushPromises()
    await wrapper.find('[data-testid="increment"]').trigger('click')
    await wrapper.find('[data-testid="increment"]').trigger('click')
    expect(wrapper.find('.counter-value').text()).toBe('2')

    await wrapper.find('[data-testid="reset"]').trigger('click')
    expect(wrapper.find('.counter-value').text()).toBe('0')
    wrapper.unmount()
  })

  it('logs onBeforeMount and onMounted on creation', async () => {
    const wrapper = mount(LifecycleDemo)
    await flushPromises()
    await wrapper.vm.$nextTick()
    const logText = wrapper.find('[data-testid="logs"]').text()
    expect(logText).toContain('onBeforeMount')
    expect(logText).toContain('onMounted')
    wrapper.unmount()
  })

  it('logs watch event when count changes', async () => {
    const wrapper = mount(LifecycleDemo)
    await flushPromises()
    await wrapper.find('[data-testid="increment"]').trigger('click')
    await wrapper.vm.$nextTick()
    const logText = wrapper.find('[data-testid="logs"]').text()
    expect(logText).toContain('watch(count): 0 -> 1')
    wrapper.unmount()
  })

  it('clears logs when clear button is clicked', async () => {
    const wrapper = mount(LifecycleDemo)
    await flushPromises()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-testid="logs"]').text()).toContain('onBeforeMount')

    await wrapper.find('[data-testid="clear-logs"]').trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-testid="logs"]').text()).toContain('Логи пусты')
    wrapper.unmount()
  })

  it('toggles auto-increment on and off', async () => {
    const wrapper = mount(LifecycleDemo)
    await flushPromises()
    const toggleBtn = wrapper.find('[data-testid="auto-toggle"]')

    expect(toggleBtn.text()).toBe('Автоинкремент')
    await toggleBtn.trigger('click')
    expect(toggleBtn.text()).toBe('Остановить авто')

    // Advance timer to check auto-increment
    vi.advanceTimersByTime(3000)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.counter-value').text()).toBe('3')

    // Stop auto-increment
    await toggleBtn.trigger('click')
    expect(toggleBtn.text()).toBe('Автоинкремент')

    // Counter should not change after stopping
    vi.advanceTimersByTime(2000)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.counter-value').text()).toBe('3')

    wrapper.unmount()
  })

  it('cleans up intervals on unmount', async () => {
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval')
    const wrapper = mount(LifecycleDemo)
    await flushPromises()

    // Start auto-increment to create timer
    await wrapper.find('[data-testid="auto-toggle"]').trigger('click')

    wrapper.unmount()
    // Should clear both alive interval and auto-increment interval
    expect(clearIntervalSpy).toHaveBeenCalled()
    clearIntervalSpy.mockRestore()
  })

  it('tracks seconds alive', async () => {
    const wrapper = mount(LifecycleDemo)
    await flushPromises()
    expect(wrapper.find('.alive-badge').text()).toContain('0 сек')

    vi.advanceTimersByTime(3000)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.alive-badge').text()).toContain('3 сек')

    wrapper.unmount()
  })
})
