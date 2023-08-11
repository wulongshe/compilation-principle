import { Grammar, Token } from './type'

export class LL1<N extends string, T extends string> {
  private current: number = 0
  private top: N | T
  private stack: number[] = []
  constructor(private G: Grammar<N, T>, private input: T[]) {
    this.top = this.input[this.current]
  }

  private next() {
    this.top = this.input[++this.current]
  }

  private mark() {
    this.stack.push(this.current)
  }

  private reset() {
    this.current = this.stack.pop()!
  }

  private inN(word: N | T) {
    return this.G.N.includes(word as N)
  }

  walk(N: N): Token<N, T> | undefined {
    const items = this.G.P[N]
    for (const item of items) {
      this.mark()
      if (item.length === 1 && item[0] === 'ε') {
        return { type: N, value: ['ε' as T] }
      }
      const result: Token<N, T>['value'] = []
      for (const it of item) {
        if (this.inN(it)) {
          const value = this.walk(it as N)
          if (!value) break
          result.push(value)
        } else {
          if (this.top !== it) break
          result.push(it as T)
          this.next()
        }
      }
      if (result.length === item.length) return { type: N, value: result }
      this.reset()
    }
  }

  parse() {
    return this.walk(this.G.S)
  }

  setInput(input: T[]) {
    this.input = input
    this.top = this.input[(this.current = 0)]
  }
}
