import { Component, input } from '@angular/core';
import { Country } from '../../interfaces/country.interface';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'country-list',
  imports: [DecimalPipe, RouterLink],
  templateUrl: './list.component.html',
})
export class ListComponent {
  countries = input.required<Country[]>();

  errorMessage = input<string | unknown | null>(null);
  isLoading = input<boolean>(false);
  isEmpty = input<boolean>(false);
}
