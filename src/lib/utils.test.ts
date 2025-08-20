import { describe, it, expect } from 'vitest'
import { formatDate, formatFileSize, slugify } from './utils'

describe('utils', () => {
  describe('formatDate', () => {
    it('formats date correctly', () => {
      const date = new Date('2023-12-25')
      const formatted = formatDate(date)
      expect(formatted).toBe('Dec 25, 2023')
    })
  })

  describe('formatFileSize', () => {
    it('formats bytes correctly', () => {
      expect(formatFileSize(1024)).toBe('1 KB')
      expect(formatFileSize(1048576)).toBe('1 MB')
      expect(formatFileSize(0)).toBe('0 Bytes')
    })
  })

  describe('slugify', () => {
    it('creates slugs correctly', () => {
      expect(slugify('Hello World')).toBe('hello-world')
      expect(slugify('React.js & TypeScript')).toBe('reactjs-typescript')
      expect(slugify('  Multiple   Spaces  ')).toBe('multiple-spaces')
    })
  })
})
