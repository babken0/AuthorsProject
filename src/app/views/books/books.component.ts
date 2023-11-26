import {Component, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatSort, MatSortModule} from "@angular/material/sort";
import {BookService} from "../../core/services/book.service";
import {Book} from "../../core/models/book-model";
import {Author} from "../../core/models/author-model";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthorService} from "../../core/services/author.service";
import {Observable, Subject, takeUntil} from "rxjs";
import {AuthorNamePipe} from "../../core/pipes/author-name.pipe";


@Component({
  selector: 'app-books',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSortModule, FormsModule, ReactiveFormsModule, AuthorNamePipe],
  templateUrl: './books.component.html',
  styleUrl: './books.component.scss'
})
export class BooksComponent implements OnInit {
  displayedColumns: string[] = ['id', 'authorId', 'name', 'publisher', 'year'];
  $authors !: Observable<Author[]>
  books: Book[] = []
  dataSource = new MatTableDataSource<Book>([]);
  bookForm !: FormGroup;
  submitted = false;

  private _unsubscribe$: Subject<void> = new Subject();

  @ViewChild(MatSort) sort!: MatSort;


  constructor(private bookService: BookService, private authorService: AuthorService, private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.bookForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      publisher: ['', [Validators.required, Validators.minLength(5)]],
      year: ['', [Validators.required]],
      authorId: ['', [Validators.required]],

    });
    this.bookService.getBooks().pipe(takeUntil(this._unsubscribe$)).subscribe(
      (books) => {
        this.books = books;
        this.dataSource.data = books
      }
    )
    this.$authors = this.authorService.getAuthors();
  }

  public onSubmit(): void {
    this.submitted = true;

    // stop here if form is invalid
    if (this.bookForm.invalid) {
      return;
    }

    const book = this.bookService.saveBook(this.bookForm.value);
    this.books.push(book);
    this.dataSource.data = this.books;
    this.onReset();
  }

  public onReset(): void {
    this.submitted = false;
    this.bookForm.reset();
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.bookForm.controls;
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

}
