import {
  Component,
  effect,
  input,
  linkedSignal,
  output,
  signal,
} from '@angular/core';

@Component({
  selector: 'country-search',
  imports: [],
  templateUrl: './search.component.html',
  styles: ``,
})
export class SearchComponent {
  placeholder = input<string>('Search by capital');
  debounceTime = input<number>(1000);
  initialValue = input<string>('');

  // signal para manejar el valor de entrada
  value = output<string>();

  inputValue = linkedSignal<string>(() => this.initialValue() ?? '');
  // Efecto para manejar el debounce
  // Este efecto se ejecuta cada vez que inputValue cambia

  debounceEffect = effect((onCleanup) => {
    const value = this.inputValue();

    const timeout = setTimeout(() => {
      this.value.emit(value);
    }, this.debounceTime());

    // Limpia el timeout cuando el efecto se destruye
    // o cuando se vuelve a ejecutar el efecto
    onCleanup(() => {
      clearTimeout(timeout);
    });
  });
}
