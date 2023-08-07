import { expect, test } from 'vitest'
import { LL1 } from '../src'

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

test('LL1RecursiveDecline', () => {
  const code = 'i+i*i'
  const ll1 = new LL1(G, code.split(''))
  expect(ll1.parse()).toEqual({
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
})
