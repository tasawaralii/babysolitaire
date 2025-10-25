export default class LinkedList {
  constructor() {
    this.head = null;
    this.size = null;
    this.tail = null;
  }
  appendAtLast(x) {
    const newNode = new Node(x);
    if (!this.head) {
      this.head = newNode;
    } else {
      const current = this.head;
      while (current.next) {
        current = current.next;
      }
      current.next = newNode;
    }
    this.size++;
    return newNode;
  }
  appendAtFirst(x) {
    const new_node = new Node(x);
    if (!this.head) {
      this.head = new_node;
    } else {
      new_node.next = this.head;
      this.head = new_node;
    }
    this.size++;
    return new_node;
  }
  size() {
    return this.size;
  }
  remove(x) {
    if (!this.head) return null;
    if (this.head.data == x) {
      this.head = this.head.next;
      this.size--;
      return;
    }
    let current = this.head;
    let prev = null;
    while (current && current.data != x) {
      prev = current;
      current = current.next;
    }
    if (current) {
      prev.next = current.next;
      this.size--;
    }
  }
}

class Node {
  constructor(x) {
    this.data = x;
    this.next = null;
  }
}
