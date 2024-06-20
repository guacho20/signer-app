import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  menus = [
    { name: 'Firmar documento', link: '/' },
    { name: 'Validar documento', link: 'validation' },
    { name: 'Validar documento avanzado', link: 'advanced-validation' },
  ];
}
