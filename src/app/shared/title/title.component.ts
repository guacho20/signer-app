import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-title',
  standalone: true,
  imports: [NgIf],
  templateUrl: './title.component.html',
})
export class TitleComponent {
  @Input({ required: true }) label!: string;
  @Input() description!: string;
}
