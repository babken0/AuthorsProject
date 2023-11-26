import { Routes } from '@angular/router';


export const routes: Routes = [
  {path: "" ,redirectTo: "authors",pathMatch:"full"},
  {path: "authors" , loadComponent: () => import('./views/authors/authors.component').then(m => m.AuthorsComponent)},
  {path: "books" , loadComponent: () => import('./views/books/books.component').then(m => m.BooksComponent)},
];
