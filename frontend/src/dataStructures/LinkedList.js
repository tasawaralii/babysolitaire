export default class LinkedList {
  constructor() {
    this.head = null;
    this.size = 0;
    this.tail = null;
  }
  appendAtLast(x) {
    const newNode = new Node(x);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode
    } else {
      let current = this.head;
      while (current.next) {
        current = current.next;
      }
      current.next = newNode;
      this.tail = newNode;
    }
    this.size++;
    return newNode;
  }
  appendAtFirst(x) {
    // console.log(x);
    const new_node = new Node(x);
    if (!this.head) {
      this.head = new_node;
      this.tail = new_node
    } else {
      new_node.next = this.head;
      this.head = new_node;
    }
    this.size++;
    return new_node;
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

  removeFromLast() {
    if (this.size == 1) {
      const head = this.head;
      this.head = null;
      this.tail = null;
      this.size--;
      return head;
    }

    let current = this.head;
    while (current.next.next) {
      current = current.next;
    }
    const node = current.next;
    current.next = null;
    this.tail = current
    this.size--;
    return node;
  }

  getLast() {
    if(!this.head) return null;
    let current = this.head
    while(current.next) {
      current = current.next
    }
    return current
  }

  removeSubList(index) {
    if (index < 0 || index > this.size - 1) return null;
    if (index == 0) {
      const head = this.head;
      this.head = null;
      this.tail = null;
      this.size = 0;
      return head;
    }
    if (index == this.size - 1) {
      return this.removeFromLast();
    }
    let count = 1;
    let current = this.head.next;
    let prev = this.head;
    while(count < index) {
      prev = current
      current = current.next
      count++;
    }

    let removedCount = 0;
    let temp = current;
    while (temp) {
      removedCount++;
      temp = temp.next;
    }

    prev.next = null;
    this.tail = prev
    this.size -= removedCount;
    return current;
  }
  appendSubList(sHead) {
    if(this.head == null) {
      this.head = sHead;
    } else {
      this.tail.next = sHead;
    }
    
    let count = 0;
    let current = sHead
    while(current) {
      count++;
      if (!current.next) this.tail = current;
      current = current.next
    }

    this.size += count
    return this.head
  }

  toArray() {
    const array = [];
    let current = this.head;
    while (current) {
      array.push(current.data);
      current = current.next;
    }
    return array;
  }
  clone() {
    const newList = new LinkedList();
    this.toArray().forEach((item) => newList.appendAtLast({...item}))
    return newList;
  }
}

class Node {
  constructor(x) {
    this.data = x;
    this.next = null;
  }
}