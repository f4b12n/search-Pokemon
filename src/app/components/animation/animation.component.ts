import { ChangeDetectionStrategy, Component, OnDestroy, computed, effect, signal } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { OverlayPanelModule } from 'primeng/overlaypanel';

@Component({
  selector: 'app-animation',
  standalone: true,
  imports: [
    HttpClientModule, 
    InputTextModule,
    ButtonModule,
    ToastModule,
    OverlayPanelModule,
    CommonModule,
  ],
  providers: [PokemonService, MessageService],
  templateUrl: './animation.component.html',
  styleUrls: ['./animation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class AnimationComponent implements OnDestroy {
  pokemonNameOrId = signal('');
  loading = signal(false);
  pokemonData = signal<any>(null);
  animationArray = signal<string[]>([]);
  indiceActual = signal(0);
  animating = signal(false);

  imagenActual = computed(() => {
    const array = this.animationArray();
    return array.length > 0 ? array[this.indiceActual()] : '';
  });
  
  constructor(
    private pokemonService: PokemonService,
    private messageService: MessageService
  ) {
    effect(() => {
      if (this.animating()) {
        this.animateFrames();
      }
    });
  }

  ngOnDestroy(): void {
    this.detenerAnimacion();
  }

  playSound(soundSource: string) {
    const audio = new Audio();
    audio.src = soundSource;
    audio.load();
    audio.play();
  }

  loadPokemon() {
    if (this.pokemonNameOrId().length > 0) {
      this.detenerAnimacion();
      this.loading.set(true);
      this.pokemonService.getPokemon(this.pokemonNameOrId()).subscribe({
        next: (pokemon: any) => {  
          this.pokemonData.set(pokemon);
          this.loading.set(false);
          console.log(this.pokemonData());
          this.animationArray.set([
            pokemon.sprites.front_default,
            pokemon.sprites.back_default
          ]);
          this.iniciarAnimacion();
          this.playSound(this.pokemonData().cries.latest);
        },
        error: (err: any) => { 
          console.log(err);
          this.showErrorToast('Nombre o ID de Pokémon no válido');
          this.loading.set(false);
        }
      });
    } else {
      this.showInfoToast('Escriba un nombre o ID para cargar');
    }
  }

  showErrorToast(message: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
  }

  showInfoToast(message: string) {
    this.messageService.add({ severity: 'info', summary: 'Información', detail: message, life: 3000 });
  }

  iniciarAnimacion() {
    this.indiceActual.set(0);
    this.animating.set(true);
  }

  animateFrames() {
    setTimeout(() => {
      if (this.animating()) {
        this.indiceActual.update(index => (index + 1) % this.animationArray().length);
        this.animateFrames();
      }
    }, 300);
  }

  detenerAnimacion() {
    this.animating.set(false);
  }

  updateName(name: string) {
    this.pokemonNameOrId.set(name.toLocaleLowerCase());
  }
}
