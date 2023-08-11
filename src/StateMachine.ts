import { NFA, DFA, StateMachine } from './type'

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
