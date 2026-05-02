function fnv1a(str: string, seed: number): number {
  let h = 2166136261 ^ seed;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export class BloomFilter {
  bits: Uint8Array;
  size: number;
  k: number;
  count = 0;
  constructor(size = 64, k = 3) {
    this.size = size;
    this.k = k;
    this.bits = new Uint8Array(size);
  }
  hashes(value: string): number[] {
    const out: number[] = [];
    for (let i = 0; i < this.k; i++) out.push(fnv1a(value, i * 131 + 17) % this.size);
    return out;
  }
  add(value: string) {
    for (const h of this.hashes(value)) this.bits[h] = 1;
    this.count++;
  }
  test(value: string): boolean {
    return this.hashes(value).every((h) => this.bits[h] === 1);
  }
  reset() {
    this.bits = new Uint8Array(this.size);
    this.count = 0;
  }
}