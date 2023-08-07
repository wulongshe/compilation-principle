import { expect, test } from 'vitest'
import { generateStateMachine } from '../src'

/**
 * V -> S0 | Q0
 * Q -> S0 | S1 | Q1
 * U -> S1 | Q1
 * Z -> V0 | U1 | Z0 | Z1
 */

// 文法 G[E]
const G = {
  N: ['V', 'Q', 'U', 'Z'],
  T: ['0', '1'],
  P: {
    V: [
      ['S', '0'],
      ['Q', '0'],
    ],
    Q: [
      ['S', '0'],
      ['S', '1'],
      ['Q', '1'],
    ],
    U: [
      ['S', '1'],
      ['Q', '1'],
    ],
    Z: [
      ['V', '0'],
      ['U', '1'],
      ['Z', '0'],
      ['Z', '1'],
    ],
  },
  S: 'V',
  F: ['Z'],
}

test.skip('StateMachine: NFA to state machine', () => {
  expect(generateStateMachine(G)).toEqual({
    S: {
      0: ['V', 'Q'],
      1: ['Q', 'U'],
    },
    V: {
      0: ['Z'],
    },
    Q: {
      0: ['V'],
      1: ['U', 'Q'],
    },
    U: {
      1: ['Z'],
    },
    Z: {
      0: ['Z'],
      1: ['Z'],
    },
  })
})
