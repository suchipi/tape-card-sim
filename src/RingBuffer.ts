export default class RingBuffer<T> {
  storage: Array<T>;
  index: number;
  valueCount: number = 0;

  constructor(size: number) {
    this.storage = Array(size);
    this.index = 0;
  }

  write(value: T) {
    this.storage[this.index] = value;
    this.index = (this.index + 1) % this.storage.length;

    if (this.valueCount !== this.storage.length) {
      this.valueCount++;
    }
  }
}
