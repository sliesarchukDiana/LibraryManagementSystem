import { IBook } from './interfaces/IBook';

export class Book implements IBook {
  constructor(
    public id: string,
    public title: string,
    public author: string,
    public year: number,
    public isBorrowed: boolean = false,
  ) {}

  toggleBorrowStatus(): void {
    this.isBorrowed = !this.isBorrowed;
  }
}
