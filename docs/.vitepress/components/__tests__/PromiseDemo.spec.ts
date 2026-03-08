import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import PromiseDemo from '../PromiseDemo.vue'

describe('PromiseDemo', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders with idle state', async () => {
    const wrapper = mount(PromiseDemo)
    await flushPromises()
    expect(wrapper.find('.state-badge').text()).toBe('Не создан')
    expect(wrapper.find('.state-badge').classes()).toContain('state-idle')
    wrapper.unmount()
  })

  it('transitions to pending state when promise is created', async () => {
    const wrapper = mount(PromiseDemo)
    await flushPromises()
    await wrapper.find('[data-testid="create-promise"]').trigger('click')
    expect(wrapper.find('.state-badge').text()).toBe('Pending')
    expect(wrapper.find('.state-badge').classes()).toContain('state-pending')
    wrapper.unmount()
  })

  it('disables create button when in pending state', async () => {
    const wrapper = mount(PromiseDemo)
    await flushPromises()
    await wrapper.find('[data-testid="create-promise"]').trigger('click')
    expect(wrapper.find('[data-testid="create-promise"]').attributes('disabled')).toBeDefined()
    wrapper.unmount()
  })

  it('enables resolve and reject buttons only in pending state', async () => {
    const wrapper = mount(PromiseDemo)
    await flushPromises()

    expect(wrapper.find('[data-testid="resolve"]').attributes('disabled')).toBeDefined()
    expect(wrapper.find('[data-testid="reject"]').attributes('disabled')).toBeDefined()

    await wrapper.find('[data-testid="create-promise"]').trigger('click')

    expect(wrapper.find('[data-testid="resolve"]').attributes('disabled')).toBeUndefined()
    expect(wrapper.find('[data-testid="reject"]').attributes('disabled')).toBeUndefined()
    wrapper.unmount()
  })

  it('transitions to fulfilled state on resolve', async () => {
    const wrapper = mount(PromiseDemo)
    await flushPromises()
    await wrapper.find('[data-testid="create-promise"]').trigger('click')
    await wrapper.find('[data-testid="resolve"]').trigger('click')
    await flushPromises()

    expect(wrapper.find('.state-badge').text()).toBe('Fulfilled')
    expect(wrapper.find('.state-badge').classes()).toContain('state-fulfilled')
    wrapper.unmount()
  })

  it('transitions to rejected state on reject', async () => {
    const wrapper = mount(PromiseDemo)
    await flushPromises()
    await wrapper.find('[data-testid="create-promise"]').trigger('click')
    await wrapper.find('[data-testid="reject"]').trigger('click')
    await flushPromises()

    expect(wrapper.find('.state-badge').text()).toBe('Rejected')
    expect(wrapper.find('.state-badge').classes()).toContain('state-rejected')
    wrapper.unmount()
  })

  it('displays result after resolve', async () => {
    const wrapper = mount(PromiseDemo)
    await flushPromises()
    await wrapper.find('[data-testid="create-promise"]').trigger('click')
    await wrapper.find('[data-testid="resolve"]').trigger('click')
    await flushPromises()

    const resultDisplay = wrapper.find('.result-display')
    expect(resultDisplay.exists()).toBe(true)
    expect(resultDisplay.classes()).toContain('result-success')
    expect(resultDisplay.text()).toContain('Данные загружены успешно!')
    wrapper.unmount()
  })

  it('displays error result after reject', async () => {
    const wrapper = mount(PromiseDemo)
    await flushPromises()
    await wrapper.find('[data-testid="create-promise"]').trigger('click')
    await wrapper.find('[data-testid="reject"]').trigger('click')
    await flushPromises()

    const resultDisplay = wrapper.find('.result-display')
    expect(resultDisplay.exists()).toBe(true)
    expect(resultDisplay.classes()).toContain('result-error')
    expect(resultDisplay.text()).toContain('Ошибка сети!')
    wrapper.unmount()
  })

  it('logs promise creation', async () => {
    const wrapper = mount(PromiseDemo)
    await flushPromises()
    await wrapper.find('[data-testid="create-promise"]').trigger('click')

    const logText = wrapper.find('[data-testid="logs"]').text()
    expect(logText).toContain('new Promise')
    expect(logText).toContain('pending')
    wrapper.unmount()
  })

  it('logs .then() on resolve', async () => {
    const wrapper = mount(PromiseDemo)
    await flushPromises()
    await wrapper.find('[data-testid="create-promise"]').trigger('click')
    await wrapper.find('[data-testid="resolve"]').trigger('click')
    await flushPromises()

    const logText = wrapper.find('[data-testid="logs"]').text()
    expect(logText).toContain('.then()')
    expect(logText).toContain('.finally()')
    wrapper.unmount()
  })

  it('logs .catch() on reject', async () => {
    const wrapper = mount(PromiseDemo)
    await flushPromises()
    await wrapper.find('[data-testid="create-promise"]').trigger('click')
    await wrapper.find('[data-testid="reject"]').trigger('click')
    await flushPromises()

    const logText = wrapper.find('[data-testid="logs"]').text()
    expect(logText).toContain('.catch()')
    expect(logText).toContain('.finally()')
    wrapper.unmount()
  })

  it('auto resolve works with 2 second timer', async () => {
    const wrapper = mount(PromiseDemo)
    await flushPromises()
    await wrapper.find('[data-testid="auto-resolve"]').trigger('click')

    expect(wrapper.find('.state-badge').text()).toBe('Pending')

    vi.advanceTimersByTime(2000)
    await flushPromises()

    expect(wrapper.find('.state-badge').text()).toBe('Fulfilled')
    expect(wrapper.find('.result-display').text()).toContain('Данные получены через 2 сек')
    wrapper.unmount()
  })

  it('auto reject works with 2 second timer', async () => {
    const wrapper = mount(PromiseDemo)
    await flushPromises()
    await wrapper.find('[data-testid="auto-reject"]').trigger('click')

    expect(wrapper.find('.state-badge').text()).toBe('Pending')

    vi.advanceTimersByTime(2000)
    await flushPromises()

    expect(wrapper.find('.state-badge').text()).toBe('Rejected')
    expect(wrapper.find('.result-display').text()).toContain('Таймаут запроса!')
    wrapper.unmount()
  })

  it('auto resolve/reject buttons disabled when not idle', async () => {
    const wrapper = mount(PromiseDemo)
    await flushPromises()
    await wrapper.find('[data-testid="create-promise"]').trigger('click')

    expect(wrapper.find('[data-testid="auto-resolve"]').attributes('disabled')).toBeDefined()
    expect(wrapper.find('[data-testid="auto-reject"]').attributes('disabled')).toBeDefined()
    wrapper.unmount()
  })

  it('resets demo to idle state', async () => {
    const wrapper = mount(PromiseDemo)
    await flushPromises()
    await wrapper.find('[data-testid="create-promise"]').trigger('click')
    await wrapper.find('[data-testid="resolve"]').trigger('click')
    await flushPromises()

    await wrapper.find('[data-testid="reset"]').trigger('click')

    expect(wrapper.find('.state-badge').text()).toBe('Не создан')
    expect(wrapper.find('.result-display').exists()).toBe(false)
    wrapper.unmount()
  })

  it('clears logs when clear button is clicked', async () => {
    const wrapper = mount(PromiseDemo)
    await flushPromises()
    await wrapper.find('[data-testid="create-promise"]').trigger('click')

    expect(wrapper.find('[data-testid="logs"]').text()).toContain('new Promise')

    await wrapper.find('[data-testid="clear-logs"]').trigger('click')
    expect(wrapper.find('[data-testid="logs"]').text()).toContain('Логи пусты')
    wrapper.unmount()
  })

  it('shows empty logs message initially', async () => {
    const wrapper = mount(PromiseDemo)
    await flushPromises()
    expect(wrapper.find('.log-empty').exists()).toBe(true)
    expect(wrapper.find('.log-empty').text()).toContain('Логи пусты')
    wrapper.unmount()
  })

  it('does not show result display when no result', async () => {
    const wrapper = mount(PromiseDemo)
    await flushPromises()
    expect(wrapper.find('.result-display').exists()).toBe(false)
    wrapper.unmount()
  })
})
