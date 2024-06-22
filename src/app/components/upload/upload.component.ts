import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [],
  templateUrl: './upload.component.html',
})
export class UploadComponent {
  @Input() label: string = 'Seleccione un documento';
  @Output() onUpload = new EventEmitter<File>();

  file!: File | undefined;

  upload(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.file = file;
      this.onUpload.emit(file);
    }
  }

  clear() {
    (this.file = undefined), this.onUpload.emit(this.file);
  }
}
