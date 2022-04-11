import RingBuffer from "./RingBuffer";

export default class RollingAverage {
  buffer: RingBuffer<number>;

  constructor(maxSize: number) {
    this.buffer = new RingBuffer(maxSize);
  }

  addDataPoint(value: number) {
    this.buffer.write(value);
  }

  calculateAverage() {
    return (
      this.buffer.storage.reduce((prev, curr) => prev + curr, 0) /
      this.buffer.valueCount
    );
  }
}
