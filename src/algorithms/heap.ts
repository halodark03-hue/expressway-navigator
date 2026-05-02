export class MaxHeap<T> {
  arr: { key: number; val: T }[] = [];
  size() { return this.arr.length; }
  push(key: number, val: T) {
    this.arr.push({ key, val });
    this._up(this.arr.length - 1);
  }
  pop() {
    if (!this.arr.length) return undefined;
    const top = this.arr[0];
    const last = this.arr.pop()!;
    if (this.arr.length) { this.arr[0] = last; this._down(0); }
    return top;
  }
  private _up(i: number) {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.arr[p].key < this.arr[i].key) { [this.arr[p], this.arr[i]] = [this.arr[i], this.arr[p]]; i = p; }
      else break;
    }
  }
  private _down(i: number) {
    const n = this.arr.length;
    while (true) {
      const l = 2 * i + 1, r = 2 * i + 2;
      let best = i;
      if (l < n && this.arr[l].key > this.arr[best].key) best = l;
      if (r < n && this.arr[r].key > this.arr[best].key) best = r;
      if (best !== i) { [this.arr[best], this.arr[i]] = [this.arr[i], this.arr[best]]; i = best; }
      else break;
    }
  }
}
