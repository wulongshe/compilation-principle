import { expect, test } from 'vitest'
import { createFirstVT, createLastVT, createSymbolPriorityTable } from '../src'

/**
 * E -> E+T | T
 * T -> T*F | F
 * F -> (E) | i
 */

// 文法 G[E]
const G = {
  N: ['E', 'T', 'F'],
  T: ['+', '*', '(', ')', 'i'],
  P: {
    E: [['E', '+', 'T'], ['T']],
    T: [['T', '*', 'F'], ['F']],
    F: [['(', 'E', ')'], ['i']],
  },
  S: 'E',
}

test('SymbolPriority: create FirstVT', () => {
  const FirstVT = createFirstVT(G)
  expect(FirstVT('E')).toEqual(['+', '*', '(', 'i'])
  expect(FirstVT('T')).toEqual(['*', '(', 'i'])
  expect(FirstVT('F')).toEqual(['(', 'i'])

  expect(FirstVT(['E', '+', 'T'])).toEqual(['+', '*', '(', 'i'])
})

test('SymbolPriority: create LastVT', () => {
  const LastVT = createLastVT(G)
  expect(LastVT('E')).toEqual(['+', '*', ')', 'i'])
  expect(LastVT('T')).toEqual(['*', ')', 'i'])
  expect(LastVT('F')).toEqual([')', 'i'])
})

test('SymbolPriority: create Symbol Table', () => {
  expect(createSymbolPriorityTable(G)).toEqual({
    '+': {
      '+': '>',
      '*': '<',
      '(': '<',
      ')': '>',
      i: '<',
    },
    '*': {
      '+': '>',
      '*': '>',
      '(': '<',
      ')': '>',
      i: '<',
    },
    '(': {
      '+': '<',
      '*': '<',
      '(': '<',
      ')': '=',
      i: '<',
    },
    ')': {
      '+': '>',
      '*': '>',
      ')': '>',
    },
    i: {
      '+': '>',
      '*': '>',
      ')': '>',
    },
  })
})
