import { Component, inject, signal } from '@angular/core';
import { SearchComponent } from '../../components/search/search.component';
import { ListComponent } from '../../components/list/list.component';
import { CountryService } from '../../services/country.service';

@Component({
  selector: 'app-by-country-page',
  standalone: true,
  imports: [SearchComponent, ListComponent],
  templateUrl: './by-country-page.component.html',
  styles: ``,
})
export class ByCountryPageComponent {
  // listSearch = signal<string[]>([]);
  countryService = inject(CountryService);

  searchByCapital(query: string) {
    console.log({ query });
  }
}
