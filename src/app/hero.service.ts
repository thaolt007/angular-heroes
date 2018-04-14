import {Injectable} from '@angular/core';
import {Hero} from './hero';
import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';
import {MessageService} from './message.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, tap} from 'rxjs/operators';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable()
export class HeroService {
  private urlApi = 'api/heroes';
  constructor(
    private messageService: MessageService,
    private http: HttpClient
  ) {}

  getListHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.urlApi).pipe(
        // tap(heroes => this.log('heroes fetched')),
        catchError(this.handleError('getHeroes', []))
      // or catchError<Hero[]>(this.handleError('getHeroes'))
      );
  }

  getHero(id: number): Observable<Hero> {
    const url = `${this.urlApi}/${id}`;
    return this.http.get<Hero>(url).pipe(
      catchError(this.handleError<Hero>(`Fetched Hero id ${id}`))
    );
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      console.error(error); // log to console instead

      this.log(`${operation} failed: ${error.message}`);

      return of(result as T);
    };
  }

  private log(message: string) {
    this.messageService.add('HeroService: ' + message);
  }

  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.urlApi, hero, httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  addHero(hero: Hero): Observable<any> {
    return this.http.post(this.urlApi, hero, httpOptions).pipe(
      tap((hero: Hero) => this.log(`add hero id=${hero.id}`)),
      catchError(this.handleError<any>('addHero'))
    );
  }
}
