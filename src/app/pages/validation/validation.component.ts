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
  signer: FirmaValido = {
    firmasValidas: true,
    integridadDocumento: true,
    error: 'null',
    certificado: [
      {
        emitidoPara: 'CRISTIAN RAFAEL VEGA TOCTAGUANO',
        emitidoPor: 'UANATACA S.A.',
        validoDesde: '2023-12-08 15:35:00',
        validoHasta: '2024-12-07 15:35:00',
        fechaFirma: '2024-06-18 10:17:53',
        fechaRevocado: '',
        certificadoVigente: true,
        clavesUso: 'Firma Electrónica, No Repudio, Cifrado de llave, ',
        fechaSelloTiempo: '',
        integridadFirma: true,
        razonFirma: '',
        localizacion: '',
        cedula: '0503733222',
        nombre: 'CRISTIAN RAFAEL',
        apellido: 'VEGA TOCTAGUANO',
        institucion: '',
        cargo: '',
        entidadCertificadora: 'UANATACA S.A.',
        serial: '3460807496926773959',
        selladoTiempo: false,
        certificadoDigitalValido: true,
      },
      {
        emitidoPara: 'VICTORIA MARICELA MINTA MARTINEZ',
        emitidoPor: 'UANATACA S.A.',
        validoDesde: '2024-02-29 07:21:00',
        validoHasta: '2025-02-28 07:21:00',
        fechaFirma: '2024-06-22 14:50:30',
        fechaRevocado: '',
        certificadoVigente: true,
        clavesUso: 'Firma Electrónica, No Repudio, Cifrado de llave, ',
        fechaSelloTiempo: '',
        integridadFirma: true,
        razonFirma: '',
        localizacion: '',
        cedula: '1750309773',
        nombre: 'VICTORIA MARICELA',
        apellido: 'MINTA MARTINEZ',
        institucion: '',
        cargo: '',
        entidadCertificadora: 'UANATACA S.A.',
        serial: '2483521304851754760',
        selladoTiempo: false,
        certificadoDigitalValido: true,
      },
    ],
  };
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
