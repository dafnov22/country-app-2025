import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RESTCountry } from '../interfaces/rest-countries.interface';
import { catchError, delay, map, Observable, of, tap, throwError } from 'rxjs';
import { Country } from '../interfaces/country.interface';
import { CountryMapper } from '../mappers/country.mapper';
import { Region } from '../interfaces/region.type';

const API_URL = 'https://restcountries.com/v3.1';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private http = inject(HttpClient);
  private queryCacheCapital = new Map<string, Country[]>(); // Cache para resultados de búsqueda por capital
  private queryCacheCountry = new Map<string, Country[]>(); // Cache para resultados de búsqueda por nombre de país
  private queryCacheRegion = new Map<Region, Country[]>(); // Cache para resultados de búsqueda por región

  searchByCapital(query: string): Observable<Country[]> {
    query = query.trim().toLowerCase();
    // console.log(`Emitiendo valor: ${query}`);
    // return of([]); // Retorna un Observable vacío si la consulta está vacía

    if (this.queryCacheCapital.has(query)) {
      // Si ya tenemos el resultado en la caché, lo retornamos directamente
      return of(this.queryCacheCapital.get(query) ?? []);
      // return of(this.queryCacheCapital.get(query) as Country[]);
    }

    console.log(`Llegando al servidor por ${query}`);

    return this.http.get<RESTCountry[]>(`${API_URL}/capital/${query}`).pipe(
      // Aquí podrías agregar más operadores RxJS si necesitas transformar los datos
      map((resp) => CountryMapper.mapRestCountryArrayToCountryArray(resp)),
      tap((countries) => {
        // Guardamos el resultado en la caché
        this.queryCacheCapital.set(query, countries);
      }),
      catchError((err) => {
        console.error('Error fetching countries by capital:', err);
        return throwError(
          () =>
            new Error(`No se encontró un país con esa capital` + `: ${query}`)
        );
      })
    );
  }

  searchByCountry(query: string): Observable<Country[]> {
    const url = `${API_URL}/name/${query}`;
    // Eliminar espacios en blanco al inicio y al final, y convertir a minúsculas
    query = query.trim().toLowerCase();

    if (this.queryCacheCountry.has(query)) {
      // Si ya tenemos el resultado en la caché, lo retornamos directamente
      return of(this.queryCacheCountry.get(query) ?? []);
    }

    return this.http.get<RESTCountry[]>(url).pipe(
      // Aquí podrías agregar más operadores RxJS si necesitas transformar los datos
      map((resp) => CountryMapper.mapRestCountryArrayToCountryArray(resp)),
      tap((countries) => {
        // Guardamos el resultado en la caché
        this.queryCacheCountry.set(query, countries);
      }),
      delay(2000), // Simula un retraso de 3 segundos
      // catchError para manejar errores de la petición HTTP
      catchError((err) => {
        console.error('Error fetching countries:', err);
        return throwError(
          () => new Error(`No se encontró un país con el nombre ${query}`)
        );
      })
    );
  }
  /**
   * Busca un país por su código alfa-2.
   * @param code El código alfa-2 del país (ejemplo: 'US' para Estados Unidos).
   * @returns Un Observable que emite un array de Country.
   */
  searchCountryByAlphaCode(code: string): Observable<Country | undefined> {
    const url = `${API_URL}/alpha/${code}`;

    return this.http.get<RESTCountry[]>(url).pipe(
      // Aquí podrías agregar más operadores RxJS si necesitas transformar los datos
      map((resp) => CountryMapper.mapRestCountryArrayToCountryArray(resp)),
      map((countries) => countries.at(0)), // Asumiendo que el código alfa-2 devuelve un solo país
      // catchError para manejar errores de la petición HTTP
      catchError((err) => {
        console.log('Error fetching countries:', err);
        return throwError(
          () => new Error(`No se encontró un país con el código ${code}`)
        );
      })
    );
  }

  /**
   * Busca países por región.
   * @param region La región a buscar (ejemplo: 'Europe').
   * @returns Un Observable que emite un array de Country.
   */
  searchByRegion(region: Region): Observable<Country[]> {
    const url = `${API_URL}/region/${region}`;

    if (this.queryCacheRegion.has(region)) {
      // Si ya tenemos el resultado en la caché, lo retornamos directamente
      return of(this.queryCacheRegion.get(region) ?? []);
    }

    return this.http.get<RESTCountry[]>(url).pipe(
      // Aquí podrías agregar más operadores RxJS si necesitas transformar los datos
      map((resp) => CountryMapper.mapRestCountryArrayToCountryArray(resp)),
      tap((countries) => {
        // Guardamos el resultado en la caché
        this.queryCacheRegion.set(region, countries);
      }),
      catchError((err) => {
        console.error('Error fetching countries by region:', err);
        return throwError(
          () => new Error(`No se encontraron países en la región ${region}`)
        );
      })
    );
  }
}
