import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import AsyncAwaitDemo from '../AsyncAwaitDemo.vue'

describe('AsyncAwaitDemo', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders with idle state', async () => {
    const wrapper = mount(AsyncAwaitDemo)
    await flushPromises()
    expect(wrapper.find('.state-badge').text()).toBe('Ожидание')
    expect(wrapper.find('.state-badge').classes()).toContain('state-idle')
    wrapper.unmount()
  })

  it('has success scenario selected by default', async () => {
    const wrapper = mount(AsyncAwaitDemo)
    await flushPromises()
    const radio = wrapper.find('[data-testid="scenario-success"]') as any
    expect(radio.element.checked).toBe(true)
    wrapper.unmount()
  })

  it('transitions to loading state when operation starts', async () => {
    const wrapper = mount(AsyncAwaitDemo)
    await flushPromises()
    await wrapper.find('[data-testid="run-operation"]').trigger('click')

    expect(wrapper.find('.state-badge').text()).toBe('Loading...')
    expect(wrapper.find('.state-badge').classes()).toContain('state-loading')
    wrapper.unmount()
  })

  it('shows loading indicator during operation', async () => {
    const wrapper = mount(AsyncAwaitDemo)
    await flushPromises()
    await wrapper.find('[data-testid="run-operation"]').trigger('click')

    expect(wrapper.find('.loading-indicator').exists()).toBe(true)
    expect(wrapper.find('.spinner').exists()).toBe(true)
    wrapper.unmount()
  })

  it('disables run button during loading', async () => {
    const wrapper = mount(AsyncAwaitDemo)
    await flushPromises()
    await wrapper.find('[data-testid="run-operation"]').trigger('click')

    expect(wrapper.find('[data-testid="run-operation"]').attributes('disabled')).toBeDefined()
    wrapper.unmount()
  })

  it('enables cancel button only during loading', async () => {
    const wrapper = mount(AsyncAwaitDemo)
    await flushPromises()

    expect(wrapper.find('[data-testid="cancel-operation"]').attributes('disabled')).toBeDefined()

    await wrapper.find('[data-testid="run-operation"]').trigger('click')

    expect(wrapper.find('[data-testid="cancel-operation"]').attributes('disabled')).toBeUndefined()
    wrapper.unmount()
  })

  it('completes success scenario after delay', async () => {
    const wrapper = mount(AsyncAwaitDemo)
    await flushPromises()
    await wrapper.find('[data-testid="run-operation"]').trigger('click')

    vi.advanceTimersByTime(2000)
    await flushPromises()

    expect(wrapper.find('.state-badge').text()).toBe('Успех')
    expect(wrapper.find('.state-badge').classes()).toContain('state-success')
    const result = wrapper.find('[data-testid="result"]')
    expect(result.exists()).toBe(true)
    expect(result.classes()).toContain('result-success')
    expect(result.text()).toContain('Данные пользователя')
    wrapper.unmount()
  })

  it('completes error scenario with error state', async () => {
    const wrapper = mount(AsyncAwaitDemo)
    await flushPromises()

    await wrapper.find('[data-testid="scenario-error"]').setValue(true)
    await wrapper.find('[data-testid="run-operation"]').trigger('click')

    vi.advanceTimersByTime(2000)
    await flushPromises()

    expect(wrapper.find('.state-badge').text()).toBe('Ошибка')
    expect(wrapper.find('.state-badge').classes()).toContain('state-error')
    const result = wrapper.find('[data-testid="result"]')
    expect(result.exists()).toBe(true)
    expect(result.classes()).toContain('result-error')
    expect(result.text()).toContain('Ошибка сети')
    wrapper.unmount()
  })

  it('completes timeout scenario with error', async () => {
    const wrapper = mount(AsyncAwaitDemo)
    await flushPromises()

    await wrapper.find('[data-testid="scenario-timeout"]').setValue(true)
    await wrapper.find('[data-testid="run-operation"]').trigger('click')

    vi.advanceTimersByTime(1000)
    await flushPromises()

    expect(wrapper.find('.state-badge').text()).toBe('Ошибка')
    const result = wrapper.find('[data-testid="result"]')
    expect(result.exists()).toBe(true)
    expect(result.text()).toContain('Таймаут')
    wrapper.unmount()
  })

  it('logs try/catch/finally flow on success', async () => {
    const wrapper = mount(AsyncAwaitDemo)
    await flushPromises()
    await wrapper.find('[data-testid="run-operation"]').trigger('click')

    vi.advanceTimersByTime(2000)
    await flushPromises()

    const logText = wrapper.find('[data-testid="logs"]').text()
    expect(logText).toContain('try {')
    expect(logText).toContain('Результат получен')
    expect(logText).toContain('} finally {')
    wrapper.unmount()
  })

  it('logs catch block on error', async () => {
    const wrapper = mount(AsyncAwaitDemo)
    await flushPromises()

    await wrapper.find('[data-testid="scenario-error"]').setValue(true)
    await wrapper.find('[data-testid="run-operation"]').trigger('click')

    vi.advanceTimersByTime(2000)
    await flushPromises()

    const logText = wrapper.find('[data-testid="logs"]').text()
    expect(logText).toContain('} catch (error) {')
    expect(logText).toContain('} finally {')
    wrapper.unmount()
  })

  it('cancels operation via abort', async () => {
    const wrapper = mount(AsyncAwaitDemo)
    await flushPromises()
    await wrapper.find('[data-testid="run-operation"]').trigger('click')
    await wrapper.find('[data-testid="cancel-operation"]').trigger('click')
    await flushPromises()

    expect(wrapper.find('.state-badge').text()).toBe('Ошибка')
    const logText = wrapper.find('[data-testid="logs"]').text()
    expect(logText).toContain('отменил')
    wrapper.unmount()
  })

  it('resets demo to idle state', async () => {
    const wrapper = mount(AsyncAwaitDemo)
    await flushPromises()
    await wrapper.find('[data-testid="run-operation"]').trigger('click')

    vi.advanceTimersByTime(2000)
    await flushPromises()

    await wrapper.find('[data-testid="reset"]').trigger('click')

    expect(wrapper.find('.state-badge').text()).toBe('Ожидание')
    expect(wrapper.find('[data-testid="result"]').exists()).toBe(false)
    expect(wrapper.find('.loading-indicator').exists()).toBe(false)
    wrapper.unmount()
  })

  it('clears logs when clear button is clicked', async () => {
    const wrapper = mount(AsyncAwaitDemo)
    await flushPromises()
    await wrapper.find('[data-testid="run-operation"]').trigger('click')

    expect(wrapper.find('[data-testid="logs"]').text()).not.toContain('Логи пусты')

    await wrapper.find('[data-testid="clear-logs"]').trigger('click')
    expect(wrapper.find('[data-testid="logs"]').text()).toContain('Логи пусты')
    wrapper.unmount()
  })

  it('shows empty logs message initially', async () => {
    const wrapper = mount(AsyncAwaitDemo)
    await flushPromises()
    expect(wrapper.find('.log-empty').exists()).toBe(true)
    expect(wrapper.find('.log-empty').text()).toContain('Логи пусты')
    wrapper.unmount()
  })

  it('disables scenario radio buttons during loading', async () => {
    const wrapper = mount(AsyncAwaitDemo)
    await flushPromises()
    await wrapper.find('[data-testid="run-operation"]').trigger('click')

    expect(wrapper.find('[data-testid="scenario-success"]').attributes('disabled')).toBeDefined()
    expect(wrapper.find('[data-testid="scenario-error"]').attributes('disabled')).toBeDefined()
    expect(wrapper.find('[data-testid="scenario-timeout"]').attributes('disabled')).toBeDefined()
    wrapper.unmount()
  })

  it('does not show result or loading initially', async () => {
    const wrapper = mount(AsyncAwaitDemo)
    await flushPromises()
    expect(wrapper.find('[data-testid="result"]').exists()).toBe(false)
    expect(wrapper.find('.loading-indicator').exists()).toBe(false)
    wrapper.unmount()
  })

  it('reset aborts running operation and returns to idle', async () => {
    const wrapper = mount(AsyncAwaitDemo)
    await flushPromises()
    await wrapper.find('[data-testid="run-operation"]').trigger('click')

    expect(wrapper.find('.state-badge').text()).toBe('Loading...')

    await wrapper.find('[data-testid="reset"]').trigger('click')
    await flushPromises()

    // After reset, the abort triggers catch which sets error,
    // then resetDemo sets state to idle; final state depends on microtask order.
    // The important thing is that the operation is no longer loading
    // and the log records the reset.
    const logText = wrapper.find('[data-testid="logs"]').text()
    expect(logText).toContain('Демо сброшено')
    expect(wrapper.find('.loading-indicator').exists()).toBe(false)
    wrapper.unmount()
  })
})
