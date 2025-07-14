import {
  Component,
  inject,
  linkedSignal,
  resource,
  signal,
} from '@angular/core';
import { SearchComponent } from '../../components/search/search.component';
import { ListComponent } from '../../components/list/list.component';
import { CountryService } from '../../services/country.service';
import { firstValueFrom, of } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-by-country-page',
  imports: [SearchComponent, ListComponent],
  templateUrl: './by-country-page.component.html',
  styles: ``,
})
export class ByCountryPageComponent {
  countryService = inject(CountryService);

  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  queryParam = this.activatedRoute.snapshot.queryParamMap.get('query') ?? '';

  query = linkedSignal<string>(() => this.queryParam); // Signal para manejar la consulta de búsqueda;

  countryResource = rxResource({
    request: () => ({ query: this.query() }),
    loader: ({ request }) => {
      if (!request.query) return of([]);

      this.router.navigate(['/country/by-country'], {
        queryParams: { query: request.query },
      });

      return this.countryService.searchByCountry(request.query);
    },
  });

  // countryResource = resource({
  //   request: () => ({ query: this.query() }),
  //   loader: async ({ request }) => {
  //     if (!request.query) return [];

  //     // return this.countryService.searchByCapital(request.query).toPromise();
  //     return await firstValueFrom(
  //       this.countryService.searchByCountry(request.query)
  //     ).catch((err) => {
  //       console.error('Error fetching countries:', err);
  //       throw new Error(
  //         `No se encontró un país con el nombre ${request.query}`
  //       );
  //     });
  //   },
  // });

  // searchByCapital(query: string) {
  //   console.log({ query });
  // }
}
