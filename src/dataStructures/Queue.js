export default class Queue {
  constructor() {
    this.items = [];
  }
  enqueue(item) {
    this.items.push(item);
  }
  dequeue() {
    if (this.items.length == 0) return undefined;
    return this.items.shift();
  }
  peek() {return this.items[0]}
  isEmpty() {return this.items.length == 0}
}
