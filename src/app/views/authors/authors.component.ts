import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Author} from "../../core/models/author-model";
import {AuthorService} from "../../core/services/author.service";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatSort, MatSortModule} from "@angular/material/sort";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-authors',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSortModule, FormsModule, ReactiveFormsModule],
  templateUrl: './authors.component.html',
  styleUrl: './authors.component.scss'
})
export class AuthorsComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['id', 'lastName', 'firsName', 'patronymic', 'birthDay'];
  authors: Author[] = []
  dataSource = new MatTableDataSource<Author>([]);
  authorForm !: FormGroup;
  submitted = false;
  authorIsExists = false;

  private _unsubscribe$: Subject<void> = new Subject();

  constructor(private authorService: AuthorService, private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {

    this.authorForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(5)]],
      lastName: ['', [Validators.required, Validators.minLength(5)]],
      patronymic: ['', [Validators.required, Validators.minLength(5)]],
      birthDay: ['', [Validators.required,]],

    });

    this.authorService.getAuthors().pipe(takeUntil(this._unsubscribe$)).subscribe(
      (authors) => {
        this.authors = authors;
        this.dataSource.data = authors
      }
    )
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.authorForm.invalid) {
      return;
    }
    let author = this.authorForm.value;
    if (this.authorService.isExists(author)) {
      this.authorIsExists = true;
    } else {
      author = this.authorService.saveAuthor(author);
      this.authors.push(author);
      this.dataSource.data = this.authors;
      this.onReset();
    }

  }

  onReset() {
    this.submitted = false;
    this.authorIsExists = false;
    this.authorForm.reset();
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.authorForm.controls;
  }

  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }
}
