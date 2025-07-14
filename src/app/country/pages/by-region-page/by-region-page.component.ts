import { Component, inject, linkedSignal, signal } from '@angular/core';
import { ListComponent } from '../../components/list/list.component';
import { CountryService } from '../../services/country.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { Region } from '../../interfaces/region.type';
import { ActivatedRoute, Router } from '@angular/router';

function validateQueryParam(queryParam: string): Region {
  const validRegions: Record<string, Region> = {
    africa: 'Africa',
    americas: 'Americas',
    asia: 'Asia',
    europe: 'Europe',
    oceania: 'Oceania',
    antarctic: 'Antarctic',
  };
  return validRegions[queryParam.toLowerCase()] ?? 'Americas'; // Default to 'Americas' if invalid
}

@Component({
  selector: 'app-by-region-page',
  imports: [ListComponent],
  templateUrl: './by-region-page.component.html',
  styles: ``,
})
export class ByRegionPageComponent {
  public regions: Region[] = [
    'Africa',
    'Americas',
    'Asia',
    'Europe',
    'Oceania',
    'Antarctic',
  ];

  countryService = inject(CountryService);

  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  queryParam = this.activatedRoute.snapshot.queryParamMap.get('region') ?? '';

  // selectedRegion = signal<Region | null>(null);
  selectedRegion = linkedSignal<Region>(() =>
    validateQueryParam(this.queryParam)
  );

  // Observable
  countryResource = rxResource({
    request: () => ({ region: this.selectedRegion() }),
    loader: ({ request }) => {
      if (!request.region) return of([]);

      this.router.navigate(['/country/by-region'], {
        queryParams: { region: request.region },
      });

      return this.countryService.searchByRegion(request.region);
    },
  });

  // searchByRegion(region: Region) {
  //   console.log(`Buscando por región: ${region}`);
  //   this.selectedRegion.set(region);
  // }
}
