import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of, throwError } from 'rxjs';
import { retry, catchError, tap } from 'rxjs/operators';
import { UtilsComponent } from '../components/shared/utils/utils.component';


@Injectable({
  providedIn: 'root'
})


export class ApiService {
  public API_URL = 'https://api.github.com/';
  public Local_API_URL = 'http://localhost:8877/';

  private cache: { [key: string]: any } = {};

  constructor(private utils: UtilsComponent, public http: HttpClient, private snackBar: MatSnackBar) { }

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  //Fetch User Detail from System and caching them
  fetchUserInfo(userName: any): Observable<any> {
    const cacheKey = `userInfo-${userName}`;
    if (this.cache[cacheKey]) {
      return of(this.cache[cacheKey]);
    }
    return this.http.get<any>(
      this.API_URL + 'users/' + userName, { observe: 'response' }).pipe(
        retry(1), tap(response => this.cache[cacheKey] = response), catchError(this.handleError.bind(this))
      )
  }

  //Fetch User repositories Detail from System and caching them
  fetchUserRepos(user: any, itemsPerPage: any, page: any): Observable<any> {
    const cacheKey = `userRepos-${user}-${itemsPerPage}-${page}`;
    if (this.cache[cacheKey]) {
      return of(this.cache[cacheKey]);
    }
    return this.http.get(
      this.API_URL + 'users/' + user + '/repos?per_page=' + itemsPerPage + '&page=' + page, { observe: 'response' }).pipe(
        retry(1), tap(response => this.cache[cacheKey] = response), catchError(this.handleError.bind(this))
      )
  }

  // Error handling
  handleError(error: any) {
    let errorMessage = 'An unknown error occurred!'; 
    if(error.status === 404){
      errorMessage = 'Invalid User! Please try valid user name';
    }
    else if(error.status === 403){
      errorMessage = 'API rate limit exceeded';
    }
    else if(error.status === 0){
      errorMessage = 'No Internet Connection';
    }
    this.utils.stopLoader();

    // snackbar to show error
    this.snackBar.open(errorMessage, 'X');
    
    return throwError(errorMessage); 
  }

}
