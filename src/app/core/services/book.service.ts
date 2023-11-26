import {Injectable} from '@angular/core';
import {Observable, of, Subject} from "rxjs";
import {LocalStorageService} from "./local-storage.service";
import {Book} from "../models/book-model";

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private static BOOKS_KEY = 'booksInfo';
  private _books$!: Observable<Book[]>;
  private _unsubscribe$: Subject<void> = new Subject();


  constructor(private _ls: LocalStorageService) {
  }

  public saveBook(newBook: Book): Book {
    const books = this._ls._getDataFromLS<Book>(BookService.BOOKS_KEY);
    newBook.id = this._generateId();
    books.push(newBook);

    this._ls.saveDataToLS(books, BookService.BOOKS_KEY);
    return newBook;
  }

  public getBooks(): Observable<Book[]> {
    if (this._ls._getDataFromLS(BookService.BOOKS_KEY).length > 0) {
      this._books$ = of(this._ls._getDataFromLS<Book>(BookService.BOOKS_KEY));
      return this._books$;
    }
    return of([]);
  }


  ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

  private _generateId(): number {
    const books = this._ls._getDataFromLS<Book>(BookService.BOOKS_KEY);
    let lastId = books.length ? books[books.length - 1].id : 0;
    return ++lastId;
  }
}
