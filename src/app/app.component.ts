import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StampSignatureComponent } from './components';
import { HeaderComponent } from './shared';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, StampSignatureComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {}
