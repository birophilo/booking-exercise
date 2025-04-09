import { createPinia } from 'pinia'
import { config } from '@vue/test-utils'

// Create a new Pinia instance for testing
const pinia = createPinia()

// Configure Vue Test Utils to use Pinia globally
config.global.plugins = [pinia]

// Mock the router
const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  go: vi.fn(),
  back: vi.fn(),
  forward: vi.fn()
}

// Add router to global config
config.global.mocks = {
  $router: mockRouter
} 