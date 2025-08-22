import nextJest from 'next/jest'

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/types/(.*)$': '<rootDir>/src/types/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
}

export default createJestConfig(customJestConfig)
