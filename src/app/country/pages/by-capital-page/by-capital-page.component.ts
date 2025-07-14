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
  selector: 'app-by-capital-page',
  imports: [SearchComponent, ListComponent],
  templateUrl: './by-capital-page.component.html',
})
export class ByCapitalPageComponent {
  countryService = inject(CountryService);

  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  queryParam = this.activatedRoute.snapshot.queryParamMap.get('query') ?? '';

  query = linkedSignal<string>(() => this.queryParam); // Signal para manejar la consulta de búsqueda;

  //EL resource solo trabaja con Promises, no con Observables
  // Por lo tanto, usamos firstValueFrom para convertir el Observable a una Promise
  //diferencia entre promise y observable:
  // Promise: Un objeto que representa la finalización o el fracaso de una operación asíncrona.
  // Observable: Un objeto que emite una secuencia de valores a lo largo del tiempo.

  // Observable
  countryResource = rxResource({
    request: () => ({ query: this.query() }),
    loader: ({ request }) => {
      // Si la consulta está vacía, retornamos un Observable vacío
      // Esto evita hacer una petición al servidor si no hay consulta
      if (!request.query) return of([]);

      this.router.navigate(['/country/by-capital'], {
        queryParams: { query: request.query },
      });

      return this.countryService.searchByCapital(request.query);
    },
  });

  // Promise:
  // countryResource = resource({
  //   request: () => ({ query: this.query() }),
  //   loader: async ({ request }) => {
  //     if (!request.query) return [];

  //     // return this.countryService.searchByCapital(request.query).toPromise();
  //     return await firstValueFrom(
  //       this.countryService.searchByCapital(request.query)
  //     );
  //   },
  // });

  // isLoading = signal(false);
  // isError = signal<string | null>(null);
  // countries = signal<Country[]>([]);

  // searchByCapital(query: string) {
  //   if (this.isLoading()) return;

  //   this.isLoading.set(true);
  //   this.isError.set(null);

  //   this.countryService.searchByCapital(query).subscribe({
  //     next: (countries) => {
  //       this.isLoading.set(false);
  //       this.countries.set(countries);
  //       // Assuming you want to set the listSearch signal with country names
  //       // this.listSearch.set(countries.map((country) => country.name.common));
  //     },
  //     error: (err) => {
  //       this.isLoading.set(false);
  //       this.countries.set([]);
  //       this.isError.set(err);
  //       // Handle error appropriately, e.g., show a notification or message to the user
  //     },
  //   });
  // }
}
