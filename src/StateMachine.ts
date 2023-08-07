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

export function generateStateMachine<N extends string, T extends string>(NFA: NFA<N, T>): StateMachine<N, T> {
  // TODO:
  return {} as StateMachine<N, T>
}

export function determineStateMachine<N extends string, T extends string>(stateMachine: StateMachine<N, T>): DFA<N, T> {
  // TODO:
  return {} as DFA<N, T>
}

export function NFA2DFA<N extends string, T extends string>(NFA: NFA<N, T>): DFA<N, T> {
  const stateMachine = generateStateMachine(NFA)
  return determineStateMachine(stateMachine)
}
