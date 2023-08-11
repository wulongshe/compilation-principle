import { Grammar } from './type'
import { createIncludes } from './utils'

/**
 * T -> a... 或 T -> Ra..., 则 a ∈ FirstVT(T)
 * T -> R... 且 a ∈ FirstVT(R), 则 a ∈ FirstVT(T)
 */
export function createFirstVT<N extends string, T extends string>(G: Grammar<N, T>) {
  const { inN, inT } = createIncludes(G)
  const FirstVTMap = {} as Record<N, T[]>
  function FirstVT(N: N): T[]
  function FirstVT(N: (N | T)[]): T[]
  function FirstVT(N: N | (N | T)[]): T[] {
    if (Array.isArray(N)) return FirstVTs(N)
    return FirstVTi(N)
  }

  function FirstVTs(NT: (N | T)[], N?: N): T[] {
    const [first1, first2] = NT
    if (inT(first1 as any)) return [first1 as T]
    else if (!inN(first2 as any)) {
      if (N && N === first1) return inT(first2 as any) ? [first2 as T] : []
      return inT(first2 as any) ? [...new Set([...FirstVTi(first1 as N), first2 as T])] : FirstVTi(first1 as N)
    } else return []
  }

  function FirstVTi(N: N): T[] {
    if (FirstVTMap[N]) return FirstVTMap[N]
    const firstVT = G.P[N].map((NT) => FirstVTs(NT, N)).flat()
    return (FirstVTMap[N] ??= [...new Set(firstVT)])
  }
  return FirstVT
}

/**
 * T -> ...a 或 T -> ...aR
 * T -> ...R 且 a ∈ LastVT(R), 则 a ∈ LastVT(T)
 */
export function createLastVT<N extends string, T extends string>(G: Grammar<N, T>) {
  const { inN, inT } = createIncludes(G)
  const LastVTMap = {} as Record<N, T[]>
  function LastVT(N: N): T[]
  function LastVT(N: (N | T)[]): T[]
  function LastVT(N: N | (N | T)[]): T[] {
    if (Array.isArray(N)) return LastVTs(N)
    return LastVTi(N)
  }

  function LastVTs(NT: (N | T)[], N?: N): T[] {
    const [last1, last2] = [...NT].reverse()
    if (inT(last1 as any)) {
      return [last1 as T]
    } else if (!inN(last2 as any)) {
      if (N && N === last1) return inT(last2 as any) ? [last2 as T] : []
      return inT(last2 as any) ? [...new Set([last2 as T, ...LastVTi(last1 as N)])] : LastVTi(last1 as N)
    } else {
      return []
    }
  }

  function LastVTi(N: N): T[] {
    if (LastVTMap[N]) return LastVTMap[N]
    const lastVT = G.P[N].map((NT) => LastVTs(NT, N)).flat()
    return (LastVTMap[N] ??= [...new Set(lastVT)])
  }
  return LastVT
}

/**
 * G文法中不存在 A->...BC... 的文法，且不含空串
 * a = b: A->...ab... 或 A->...aBb...
 * a < b: A->...aB..., B->b... 或 B->Cb...
 * a > b: A->...Bb..., B->...a 或 B->...aC
 */
export function createSymbolPriorityTable<N extends string, T extends string>(G: Grammar<N, T>) {
  const { inN, inT } = createIncludes(G)
  const symbolTable = {} as Record<T, Record<T, '>' | '<' | '=' | undefined>>
  const FirstVT = createFirstVT(G)
  const LastVT = createLastVT(G)
  const programs = Object.values(G.P).flat(1) as (N | T)[][]
  programs.forEach((program) => {
    for (let i = 0; i < program.length - 1; i++) {
      const [a, b, c] = program.slice(i, i + 3)
      if (inT(a as any) && inN(b as any) && inT(c as any)) {
        ;(symbolTable[a as T] ??= {} as any)[c as T] = '='
      }
      if (inT(a as any) && inT(b as any)) {
        ;(symbolTable[a as T] ??= {} as any)[b as T] = '='
        continue
      }
      if (inN(a as any) || inT(b as any)) {
        LastVT(a as N).forEach((op) => ((symbolTable[op] ??= {} as any)[b as T] = '>'))
        continue
      }
      if (inT(a as any) && inN(b as any)) {
        FirstVT(b as N).forEach((op) => ((symbolTable[a as T] ??= {} as any)[op] = '<'))
        continue
      }
    }
  })
  return symbolTable
}
