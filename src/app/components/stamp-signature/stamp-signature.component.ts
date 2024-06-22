import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
  inject,
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';

if (pdfjs !== undefined) {
  console.log('set worker...');
  const workerUrl = `https://npmcdn.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.mjs`;
  pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
}

@Component({
  selector: 'app-stamp-signature',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stamp-signature.component.html',
  styles: `
  canvas {
    width: 100%;
    cursor: pointer;

  }
  .pdf-container {
  position: relative;
  z-index: 0;
 
}

.indicator-overlay {
  z-index: 1; 
 /*  border: 1px solid red; */
  position: absolute;
  top: 0;
  left: 0;
  width: 100%; 
  height: 100%; 
  pointer-events: none; 
}

.indicator-image {

  width: 110px;
    height: 40px;
    position: absolute;
    border: solid 1px;
    border-color: rgba(0, 0, 0, 0.2);
}

.warning-message {
  color: red;
  font-weight: bold;
  margin-top: 10px;
}
  `,
})
export class StampSignatureComponent implements OnChanges {
  @Input({ required: true, alias: 'pdf' }) pdfUrl!: string | ArrayBuffer;
  @Output() onSignerPosition = new EventEmitter<{ x: number; y: number }>();

  @ViewChild('pdfCanvas')
  pdfCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('indicatorImage')
  indicatorImage!: ElementRef<HTMLImageElement>;

  private toastr = inject(ToastrService);

  currentPage: number = 1;
  totalPages: number = 0;
  private pdf: any;
  private pdfPage: any;
  private viewport: any;

  private canvasContext!: CanvasRenderingContext2D | null;
  lastIndicatorPosition: { x: number; y: number } | null = null;

  public showWarningMessage: boolean = false;

  constructor() {
    //this.loadPdf();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if (changes['pdfUrl']) {
      console.log('Cargo el archivo');
      this.loadPdf();
    }
    //throw new Error('Method not implemented.');
  }

  async loadPdf() {
    //this.pdf = await pdfjs.getDocument('1723174825.pdf').promise;
    this.pdf = await pdfjs.getDocument(this.pdfUrl).promise;
    this.totalPages = this.pdf.numPages;
    this.renderPage(this.currentPage);
  }

  async renderPage(pageNumber: number) {
    this.pdfPage = await this.pdf.getPage(pageNumber);
    this.viewport = this.pdfPage.getViewport({ scale: 1.5 });
    const canvas = this.pdfCanvas.nativeElement;
    this.canvasContext = canvas.getContext('2d');
    canvas.height = this.viewport.height;
    canvas.width = this.viewport.width;

    console.log(canvas.width, canvas.height);
    const renderContext = {
      canvasContext: this.canvasContext,
      viewport: this.viewport,
    };

    this.pdfPage.render(renderContext);
    this.lastIndicatorPosition = null; // Reset last indicator position
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.renderPage(this.currentPage);
    }
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.renderPage(this.currentPage);
    }
  }

  onCanvasClick(event: MouseEvent) {
    console.log(this.pdfPage);
    const canvas = this.pdfCanvas.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Tamaño real del documento PDF
    const realWidth = this.pdfPage.view[2] + 189;
    const realHeight = this.pdfPage.view[3];

    // Coordenadas en el tamaño real del documento PDF
    /* const realX = (x / this.viewport.width) * realWidth;
    const realY = (y / this.viewport.height) * realHeight; */
    const realX = x + 3;
    const realY = realHeight - y;

    console.log(
      { realWidth, realHeight },
      { x, y },
      { vx: canvas.width, vy: canvas.height }
    );

    this.lastIndicatorPosition = { x, y };
    this.onSignerPosition.emit({
      x: Math.round(realX),
      y: Math.round(realY - 22),
    });
    this.showWarningMessage = false;
  }
}
