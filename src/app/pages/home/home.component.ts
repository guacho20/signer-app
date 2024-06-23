import { JsonPipe, NgIf } from '@angular/common';
import { Component, ViewChild, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { StampSignatureComponent, UploadComponent } from '@components/index';
import { Documents } from '@models/index';
import { TitleComponent } from '@shared/index';
import { ToastrService } from 'ngx-toastr';
import { FirmaecService } from '../../services/firmaec.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    JsonPipe,
    StampSignatureComponent,
    UploadComponent,
    TitleComponent,
  ],
  templateUrl: './home.component.html',
})
export default class HomeComponent {
  @ViewChild('upload') upload!: UploadComponent;
  private _formBuilder = inject(FormBuilder);
  private _firmaEcService = inject(FirmaecService);
  private _toastr = inject(ToastrService);

  position: any;
  token!: string;
  option: 1 | 2 | 3 = 1;
  pdfSrc!: string | ArrayBuffer;
  archivos: Documents[] = [];

  signerForm: FormGroup = this._formBuilder.group({
    cedula: ['', [Validators.required]],
    file: [null, Validators.required],
  });

  onUpload(file: File) {
    if (file) {
      this.pdfSrc = URL.createObjectURL(file);
      console.log(file, this.pdfSrc);
      this.signerForm.get('file')?.setValue(file);
      this.pdftobase64(file);
      return;
    } else {
      this.signerForm.get('file')?.setValue(null);
    }
    console.log(this.signerForm.get('file')?.value);
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
    this.archivos = [];
    Promise.all(filePromises).then((base64Array) => {
      base64Array.forEach((base64) => {
        let doc: Documents;
        doc = { documento: base64, nombre: file.name };
        this.archivos.push(doc);
        //this.nombres.push(event.files[index].name);
      });

      // Resto de la lógica que depende de la información transformada a base64
      console.log('Archivos:', this.archivos);
      //this.cargaMintel();
      //this.obtenerToken();
      //this.habilitarBoton();
    });
  }

  onPosition(position: any) {
    console.log(position);
    this.position = position;
  }

  onSigner() {
    const { cedula } = this.signerForm.value;
    this.signerForm.disable();
    this._firmaEcService
      .getToken({ cedula: cedula, sistema: 'iess', documentos: this.archivos })
      .subscribe(
        (data: string) => {
          this.token = data;
          this.signerForm.enable();
          console.log(data);
          this.option = 2;
        },
        () => this.signerForm.enable()
      );
    //this.canSigner = !this.canSigner;
  }

  signer() {
    /* this._firmaEcService.sign(this.token).subscribe((res) => {
      this._toastr.info('Documento firmado correctamente');
      console.log(res);
    }); */
    window.open(
      'firmaec://iess/firmar?token=' +
        this.token +
        '&tipo_certificado=2&pagina=1&llx=' +
        this.position.x +
        '&lly=' +
        this.position.y +
        '&estampado=QR&razon=firmaEC&url=http%3A%2F%2F192.168.0.105%3A8080%2Fapi',
      '_blank'
    );
    /* window.open(
      'firmaec://iess/firmar?token=eyJhbGciOiJIUzUxMiJ9.eyJjZWR1bGEiOiIwNTAzNzMzMjIyIiwic2lzdGVtYSI6Imllc3MiLCJpZHMiOiIxMjciLCJleHAiOjE3MTkwMTQ1MTV9.0kcPTeedQ4JlUkzaWTDD3mz_iMh0636Z017tyviAivUB1mbSX20HnAB1_CRFMqpQiR_65-0gTsOt7l916Llyzg&tipo_certificado=2&llx=222&lly=320&pagina=1&estampado=QR&razon=firmaEC&url=http%3A%2F%2F192.168.0.105%3A8080%2Fapi',
      '_blank'
    ); */
    //this.option = 3;
    //this.canSigner = !this.canSigner;
  }

  reset() {
    this.signerForm.reset();
    //this.upload.reset();
    this.option = 1;
  }
}
