import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RESTCountry } from '../interfaces/rest-countries.interface';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Country } from '../interfaces/country.interface';
import { CountryMapper } from '../mappers/country.mapper';

const API_URL = 'https://restcountries.com/v3.1';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private http = inject(HttpClient);

  searchByCapital(query: string): Observable<Country[]> {
    query = query.trim().toLowerCase();

    return this.http.get<RESTCountry[]>(`${API_URL}/capital/${query}`).pipe(
      // Aquí podrías agregar más operadores RxJS si necesitas transformar los datos
      map((resp) => CountryMapper.mapRestCountryArrayToCountryArray(resp)),
      catchError((err) => {
        console.error('Error fetching countries by capital:', err);
        return throwError(
          () =>
            new Error(`No se encontró un país con esa capital` + `: ${query}`)
        );
      })
    );
  }
}
// Base URL for the REST API
// private baseUrl = 'https://restcountries.com/v3.1';
