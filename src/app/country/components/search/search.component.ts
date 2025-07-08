import { Component, input, output } from '@angular/core';

@Component({
  selector: 'country-search',
  standalone: true,
  imports: [],
  templateUrl: './search.component.html',
  styles: ``,
})
export class SearchComponent {
  placeholder = input<string>('Search by capital');
  value = output<string>();
}
