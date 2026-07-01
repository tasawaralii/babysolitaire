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
  peek() {
    return this.items[0];
  }
  size() {
    return this.items.length; 
  }
  isEmpty() {
    return this.items.length == 0;
  }
  toArray() {
    return this.items
  }
  clone() {
    const newQueue = new Queue()
    for(const item of this.items) {
      newQueue.enqueue(item)
    }
    return newQueue
  }
}
