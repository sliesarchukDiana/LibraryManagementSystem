import { IUser } from './interfaces/IUser';

export class User implements IUser {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public borrowedBooks: string[] = [],
  ) {}

  canBorrow(): boolean {
    return this.borrowedBooks.length < 3;
  }

  borrowBook(bookId: string): void {
    if (this.canBorrow()) {
      this.borrowedBooks.push(bookId);
    }
  }

  returnBook(bookId: string): void {
    this.borrowedBooks = this.borrowedBooks.filter((id) => id !== bookId);
  }
}
