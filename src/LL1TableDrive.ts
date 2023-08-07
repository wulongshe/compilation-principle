export interface Grammar<N extends string, T extends string> {
  N: N[]
  T: T[]
  P: Record<N, (N | T)[][]>
  S: N
}

export interface AST<N extends string, T extends string> {
  type: N
  value: (AST<N, T> | T)[]
}

export function createFirst<N extends string, T extends string>(G: Grammar<N, T>) {
  const FirstMap = {} as Record<N, T[][]>
  function First(N: N): T[][]
  function First(N: (N | T)[]): T[]
  function First(N: N | (N | T)[]): T[][] | T[] {
    if (Array.isArray(N)) return G.N.includes(N[0] as any) ? First(N[0] as N).flat() : [N[0] as T]

    if (FirstMap[N]) return FirstMap[N]
    const first = G.P[N].map(([it]) => (G.N.includes(it as any) ? First(it as N).flat() : [it as T]))
    return (FirstMap[N] ??= [...new Set(first)])
  }
  return First
}

export function createFollow<N extends string, T extends string>(G: Grammar<N, T>) {
  const FollowMap = {} as Record<N, T[]>
  const First = createFirst(G)

  function FollowItem(N: N, key: N, item: (N | T)[]): T[] {
    if (!item.includes(N)) return []
    const index = item.indexOf(N)
    // N 在最后一个位置
    if (index === item.length - 1) {
      return N === key ? [] : Follow(key)
    }

    // N 后面一个符号的 First 集合
    const first = G.N.includes(item[index + 1] as any) ? First(item[index + 1] as N).flat() : [item[index + 1] as T]

    if (!first.includes('ε' as T) || N === key) return first.filter((item) => item !== 'ε')
    // N 后面的符号可以推出 ε
    return [...Follow(key), ...first.filter((item) => item !== 'ε')]
  }

  function Follow(N: N): T[] {
    if (FollowMap[N]) return FollowMap[N]
    const follow = Object.entries(G.P)
      .map((([key, value]: [N, (N | T)[][]]) => value.map((item) => FollowItem(N, key, item)).flat()) as () => T[])
      .flat()
    if (N === G.S) follow.push('#' as T)
    return (FollowMap[N] = [...new Set(follow)])
  }
  return Follow
}

export function createSelect<N extends string, T extends string>(G: Grammar<N, T>) {
  const First = createFirst(G)
  const Follow = createFollow(G)
  const SelectMap = {} as Record<N, T[][]>
  for (const [N, items] of Object.entries(G.P) as [N, (N | T)[][]][]) {
    SelectMap[N as N] = items.map((item) => {
      const first = First(item).flat() as T[]
      const first1 = first.filter((val) => val !== 'ε')
      if (!first.includes('ε' as T)) return first1
      return [...new Set([...first1, ...Follow(N as N)])]
    })
  }
  return SelectMap
}

export function createTable<N extends string, T extends string>(G: Grammar<N, T>) {
  const First = createFirst(G)
  const Follow = createFollow(G)
  const TableMap = {} as Record<N, Record<T, (N | T)[]>>

  G.N.forEach((N) => {
    TableMap[N] = {} as Record<T, (N | T)[]>
    G.P[N].forEach((item) => {
      const first = First(item)
      if (first.includes('ε' as T)) {
        const follow = Follow(N)
        follow.forEach((it) => (TableMap[N][it] = item))
      } else {
        first.forEach((it) => (TableMap[N][it] = item))
      }
    })
  })

  return TableMap
}

export function createAstByLL1<N extends string, T extends string>(G: Grammar<N, T>, code: string) {
  const table = createTable(G)
  const stack = ['#', G.S] as (N | T)[]
  const input = [...code, '#'] as T[]
  const ast = { type: G.S, value: ['ε'] } as any
  const astStack = [ast]

  while (true) {
    const top = stack[stack.length - 1]
    const next = input[0]
    if (top === '#' && next === '#') {
      return ast
    }
    if (top === next) {
      stack.pop()
      astStack.pop()
      input.shift()
    } else {
      const item = table[top as N][next as T]
      if (!item) return
      stack.pop()
      const node = astStack.pop()!

      if (item[0] === 'ε') continue
      stack.push(...[...item].reverse())

      node.value = item.map((it) => (G.N.includes(it as N) ? { type: it, value: ['ε'] } : it))
      astStack.push(...[...node.value].reverse())
    }
  }
}
