import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Quote } from '../domain';

@Injectable()
export class QuoteService {
  constructor(@Inject('BASE_CONFIG') private config: { uri: string },
    private http: HttpClient) {
  }

  getQuote(): Observable<Quote> {
    const uri = `${this.config.uri}/quotes/${Math.floor(Math.random() * 10)}`;
    return this.http.get<Quote>(uri);
  }
}
