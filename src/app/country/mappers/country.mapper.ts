import { Country } from '../interfaces/country.interface';
import { RESTCountry } from '../interfaces/rest-countries.interface';

export class CountryMapper {
  static mapRestCountryToCountry(restCountry: RESTCountry): Country {
    return {
      cca2: restCountry.cca2,
      flag: restCountry.flag,
      flagSvg: restCountry.flags.svg,
      name: restCountry.translations['spa']?.common || restCountry.name.common, // Si no hay traducción al español, usar el nombre común
      // capital: restCountry.capital ? restCountry.capital[0] : 'No capital',
      capital: restCountry.capital.join(','), //unir en caso de que haya mas de una capital
      population: restCountry.population,
    };
  }

  static mapRestCountryArrayToCountryArray(
    restCountry: RESTCountry[]
  ): Country[] {
    // return restCountry.map((item) => this.mapRestCountryToCountry(item));
    return restCountry.map(this.mapRestCountryToCountry); // Es lo mismo que la línea de arriba, pero más conciso
  }
}
