import { Component, inject, signal } from '@angular/core';
import { ListComponent } from '../../components/list/list.component';
import { RESTCountry } from '../../interfaces/rest-countries.interface';
import { CountryService } from '../../services/country.service';

@Component({
  selector: 'app-by-region-page',
  standalone: true,
  imports: [ListComponent],
  templateUrl: './by-region-page.component.html',
  styles: ``,
})
export class ByRegionPageComponent {
  countryService = inject(CountryService)
    .searchByCapital('query')
    .subscribe({
      next: (countries) => {
        this.isLoading.set(false);
        // this.countries.set(countries);
        // this.listSearch.set(countries.map((country) => country.name.common));
      },
      error: (err) => {
        console.error('Error fetching countries by capital:', err);
        // Handle error appropriately, e.g., show a notification or message to the user
      },
    });

  isLoading = signal(false);
  isError = signal<string | null>(null);
  countries = signal<RESTCountry[]>([]);
}
