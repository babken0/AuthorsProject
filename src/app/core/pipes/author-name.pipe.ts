import {Pipe, PipeTransform} from '@angular/core';
import {AuthorService} from "../services/author.service";
import {map, Observable, Subject, takeUntil} from "rxjs";

@Pipe({
  name: 'authorName',
  standalone: true
})
export class AuthorNamePipe implements PipeTransform {

  private _unsubscribe$: Subject<void> = new Subject();

  constructor(private authorService: AuthorService) {
  }

  transform(authorId: number): Observable<string> {
    return this.authorService.getAuthors().pipe(
      takeUntil(this._unsubscribe$),
      map(authors => {
        const author = authors.find(author => author.id === authorId);
        if (author) {
          return `${author.lastName} ${author.firstName} ${author.patronymic}`;
        }
        return '';
      }),
    );
  }


  ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }
}
