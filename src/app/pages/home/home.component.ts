import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { StampSignatureComponent } from '../../components';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, StampSignatureComponent],
  templateUrl: './home.component.html',
})
export default class HomeComponent {
  canSigner = true;
  pdfSrc!: string | ArrayBuffer;

  private _formBuilder = inject(FormBuilder);
  signerForm: FormGroup = this._formBuilder.group({
    cedula: ['', [Validators.required]],
    file: [null, Validators.required],
  });

  upload(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.pdfSrc = URL.createObjectURL(file);
      console.log(file, this.pdfSrc);
      return;
    }
    this.pdfSrc = '';
    console.log(event);
  }

  onSigner() {
    this.canSigner = !this.canSigner;
  }
}
