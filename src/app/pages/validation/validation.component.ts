import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { UploadComponent } from '@components/index';
import { FirmaValido } from '@models/signer.model';
import { FirmaecService } from '@service/firmaec.service';
import { TitleComponent } from '@shared/index';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-validation',
  standalone: true,
  imports: [UploadComponent, TitleComponent, JsonPipe],
  templateUrl: './validation.component.html',
})
export default class ValidationComponent {
  private _firmaEcService = inject(FirmaecService);
  private _toastr = inject(ToastrService);
  signer!: FirmaValido;
  base64!: string | undefined;
  isLoading = false;

  activeIndex: number | null = null;

  upload(file: File) {
    if (file) {
      this.pdftobase64(file);
      return;
    }
    this.base64 = undefined;
  }

  pdftobase64(file: File) {
    const filePromises: Promise<string>[] = [];

    const promise = new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsBinaryString(file);
      reader.onload = (event) => {
        const base64 = btoa(event.target!.result!.toString());
        resolve(base64);
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });

    filePromises.push(promise);

    Promise.all(filePromises).then((base64Array) => {
      base64Array.forEach((base64) => {
        this.base64 = base64;
      });
    });
  }

  validatePDF() {
    if (!this.base64) {
      this._toastr.warning('Seleccione un documento PDF para validar');
      return;
    }
    this.isLoading = true;
    this._firmaEcService.validateDocument(this.base64).subscribe(
      (res) => {
        this.signer = res;
        this.isLoading = false;
      },
      (err) => {
        console.log(err), (this.isLoading = false);
      }
    );
  }

  toggle(index: number): void {
    this.activeIndex = this.activeIndex === index ? null : index;
  }
}
