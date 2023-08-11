export interface NFA<N extends string, T extends string> {
  N: N[]
  T: T[]
  P: Record<N, (N | T)[][]>
  S: N
  F: N[]
}

export interface DFA<N extends string, T extends string> extends NFA<N, T> {
  D: {
    [key in N]: N[]
  }
}

export type StateMachine<N extends string = string, T extends string = string> = Record<N, Record<T, N[]>>

export interface Grammar<N extends string, T extends string> {
  N: N[]
  T: T[]
  P: Record<N, (N | T)[][]>
  S: N
}

export interface Token<N extends string, T extends string> {
  type: N
  value: (Token<N, T> | T)[]
}

