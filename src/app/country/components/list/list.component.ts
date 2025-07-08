import { Component, input } from '@angular/core';
import { Country } from '../../interfaces/country.interface';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'country-list',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './list.component.html',
})
export class ListComponent {
  countries = input.required<Country[]>();
}
