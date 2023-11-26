import {Injectable} from '@angular/core';
import {Observable, of} from "rxjs";
import {Author} from "../models/author-model";
import {LocalStorageService} from "./local-storage.service";

@Injectable({
  providedIn: 'root'
})
export class AuthorService {

  private static AUTHORS_KEY = 'authorsInfo';


  constructor(private _ls: LocalStorageService) {
  }


  public saveAuthor(newAuthor: Author): Author {
    const authors = this._ls._getDataFromLS<Author>(AuthorService.AUTHORS_KEY);
    newAuthor.id = this._generateId();
    authors.push(newAuthor);

    this._ls.saveDataToLS(authors, AuthorService.AUTHORS_KEY);
    return newAuthor;
  }

  public getAuthors(): Observable<Author[]> {
    const authors = this._ls._getDataFromLS<Author>(AuthorService.AUTHORS_KEY);
    if (authors && authors.length > 0) {
      return of(authors);
    }
    return of([]);
  }

  public isExists(newAuthor: Author): boolean {
    const authors = this._ls._getDataFromLS<Author>(AuthorService.AUTHORS_KEY);
    return authors.some((author => {
        return author.firstName === newAuthor.firstName && author.lastName === newAuthor.lastName
          && author.patronymic === newAuthor.patronymic && author.birthDay === newAuthor.birthDay;
      })
    )
  }

  private _generateId(): number {
    const authors = this._ls._getDataFromLS<Author>(AuthorService.AUTHORS_KEY);
    let lastId = authors.length ? authors[authors.length - 1].id : 0;
    return ++lastId;
  }

}
