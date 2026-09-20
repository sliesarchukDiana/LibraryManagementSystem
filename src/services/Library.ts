export class Library<T extends { id: string }> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  remove(id: string): void {
    this.items = this.items.filter((item) => item.id !== id);
  }

  find(id: string): T | undefined {
    return this.items.find((item) => item.id === id);
  }

  getAll(): T[] {
    return this.items;
  }

  setItems(items: T[]): void {
    this.items = items;
  }
}
