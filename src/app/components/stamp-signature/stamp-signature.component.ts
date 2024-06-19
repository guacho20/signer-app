import { Component, ElementRef, ViewChild } from '@angular/core';
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';

if (pdfjs !== undefined) {
  console.log('set worker...');
  pdfjs.GlobalWorkerOptions.workerSrc = `https://npmcdn.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.mjs`;
}

@Component({
  selector: 'app-stamp-signature',
  standalone: true,
  imports: [],
  templateUrl: './stamp-signature.component.html',
  styles: `.pdf-container {
    overflow: auto;
    width: 100%;
    height: 500px;
  }
  
  canvas {
    //width: 99%;
    height: auto;
    cursor: pointer;
  }`,
})
export class StampSignatureComponent {
  @ViewChild('pdfCanvas')
  pdfCanvas!: ElementRef<HTMLCanvasElement>;

  currentPage: number = 1;
  totalPages: number = 0;
  pdfDoc: any;
  scale: number = 1.5;

  constructor() {
    this.loadPdf();
  }

  async loadPdf() {
    const pdfUrl = encodeURI('https://pdfobject.com/pdf/sample.pdf'); // Ruta del archivo PDF
    this.currentPage = 1;
    this.pdfDoc = await pdfjs.getDocument(pdfUrl).promise;

    this.totalPages = this.pdfDoc.numPages;
    this.renderPage();
  }

  async renderPage() {
    const page = await this.pdfDoc.getPage(this.currentPage);
    const viewport = page.getViewport({ scale: this.scale });
    const canvas = this.pdfCanvas.nativeElement;
    const context = canvas.getContext('2d')!;
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    // Limpiar el canvas antes de renderizar la nueva página
    //context.clearRect(0, 0, canvas.width, canvas.height);
    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };
    await page.render(renderContext).promise;
    // Reiniciar la posición actual
    //this.currentPosition = null;
    /* if (this.currentPosition) {
      this.drawIndicator(this.currentPosition.x, this.currentPosition.y);
    } */
    // Dibujar el indicador si hay una posición actual
    /* if (this.currentPosition && this.currentPage) {
      this.drawIndicator(this.currentPosition['x'], this.currentPosition['y']);
      //this.showSVGIndicator(this.currentPosition.x, this.currentPosition.y);
    } */
  }
}
