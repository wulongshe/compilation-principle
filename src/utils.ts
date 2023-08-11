import { Grammar } from './type'

export function createIncludes<N extends string, T extends string>(G: Grammar<N, T>) {
  return {
    inN(lexer: N | T) {
      return G.N.includes(lexer as any)
    },
    inT(lexer: N | T) {
      return G.T.includes(lexer as any)
    },
  }
}
