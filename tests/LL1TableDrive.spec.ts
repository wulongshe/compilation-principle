import { expect, test } from 'vitest'
import { createFirst, createFollow, createSelect, createTable, createAstByLL1 } from '../src'

/**
 * E -> TE'
 * E' -> +TE' | ε
 * T -> FT'
 * T' -> *FT' | ε
 * F -> (E) | i
 */

// 文法 G[E]
const G = {
  N: ['E', 'E1', 'T', 'T1', 'F'],
  T: ['+', '*', '(', ')', 'i', 'ε', '#'],
  P: {
    E: [['T', 'E1']],
    E1: [['+', 'T', 'E1'], ['ε']],
    T: [['F', 'T1']],
    T1: [['*', 'F', 'T1'], ['ε']],
    F: [['(', 'E', ')'], ['i']],
  },
  S: 'E',
}

test('LL1TableDrive First', () => {
  const First = createFirst(G)
  expect(First('E')).toEqual([['(', 'i']])
  expect(First('E1')).toEqual([['+'], ['ε']])
  expect(First('T')).toEqual([['(', 'i']])
  expect(First('T1')).toEqual([['*'], ['ε']])
  expect(First('F')).toEqual([['('], ['i']])
})

test('LL1TableDrive Follow', () => {
  const Follow = createFollow(G)

  expect(Follow('E')).toEqual([')', '#'])
  expect(Follow('E1')).toEqual([')', '#'])
  expect(Follow('T')).toEqual([')', '#', '+'])
  expect(Follow('T1')).toEqual([')', '#', '+'])
  expect(Follow('F')).toEqual([')', '#', '+', '*'])
})

test('LL1TableDrive Select', () => {
  expect(createSelect(G)).toEqual({
    E: [['(', 'i']],
    E1: [['+'], [')', '#']],
    T: [['(', 'i']],
    T1: [['*'], [')', '#', '+']],
    F: [['('], ['i']],
  })
})

test('LL1TableDrive Table', () => {
  expect(createTable(G)).toEqual({
    E: {
      '(': ['T', 'E1'],
      i: ['T', 'E1'],
    },
    E1: {
      '+': ['+', 'T', 'E1'],
      ')': ['ε'],
      '#': ['ε'],
    },
    T: {
      '(': ['F', 'T1'],
      i: ['F', 'T1'],
    },
    T1: {
      '+': ['ε'],
      '*': ['*', 'F', 'T1'],
      ')': ['ε'],
      '#': ['ε'],
    },
    F: {
      '(': ['(', 'E', ')'],
      i: ['i'],
    },
  })
})

test('createAstByLL1', () => {
  const code = 'i+i*i'
  expect(createAstByLL1(G, code)).toEqual({
    type: 'E',
    value: [
      {
        type: 'T',
        value: [
          { type: 'F', value: ['i'] },
          { type: 'T1', value: ['ε'] },
        ],
      },
      {
        type: 'E1',
        value: [
          '+',
          {
            type: 'T',
            value: [
              { type: 'F', value: ['i'] },
              { type: 'T1', value: ['*', { type: 'F', value: ['i'] }, { type: 'T1', value: ['ε'] }] },
            ],
          },
          { type: 'E1', value: ['ε'] },
        ],
      },
    ],
  })

  // const code2 = '(i+i)*i'
  // expect(createAstByLL1(G, code2)).toEqual({})
})
