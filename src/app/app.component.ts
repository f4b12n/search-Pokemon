import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import AnimationComponent from "./components/animation/animation.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AnimationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'searchPokemon';
}
