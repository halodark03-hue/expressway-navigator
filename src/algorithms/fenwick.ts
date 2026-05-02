export class Fenwick {
  n: number;
  tree: number[];
  vals: number[];
  constructor(arr: number[]) {
    this.n = arr.length;
    this.tree = new Array(this.n + 1).fill(0);
    this.vals = [...arr];
    for (let i = 0; i < this.n; i++) this._add(i + 1, arr[i]);
  }
  private _add(i: number, delta: number) {
    for (; i <= this.n; i += i & -i) this.tree[i] += delta;
  }
  update(idx: number, value: number) {
    const delta = value - this.vals[idx];
    this.vals[idx] = value;
    this._add(idx + 1, delta);
  }
  prefix(i: number) {
    let s = 0;
    for (; i > 0; i -= i & -i) s += this.tree[i];
    return s;
  }
  range(l: number, r: number) {
    return this.prefix(r + 1) - this.prefix(l);
  }
  updatePath(idx: number) {
    const path: number[] = [];
    for (let i = idx + 1; i <= this.n; i += i & -i) path.push(i);
    return path;
  }
  queryPath(i: number) {
    const path: number[] = [];
    for (let x = i; x > 0; x -= x & -x) path.push(x);
    return path;
  }
}