import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
//import worker from 'pdfjs-dist/legacy/build/pdf.worker.mjs';
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';

if (pdfjs !== undefined) {
  console.log('set worker...');
  pdfjs.GlobalWorkerOptions.workerSrc = `https://npmcdn.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.mjs`;
  //pdfjs.GlobalWorkerOptions.workerSrc = worker;
}

@Component({
  selector: 'app-stamp-signature',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stamp-signature.component.html',
  styles: `
  .pdf-container {
        overflow: auto;
        width: 100%;
        height: 500px; 
      }

      canvas {
        display: block;
        border: 1px solid black;
      }

  `,
})
export class StampSignatureComponent implements OnChanges {
  @Input({ required: true, alias: 'pdf' }) pdfUrl!: string | ArrayBuffer;

  @ViewChild('pdfCanvas')
  pdfCanvas!: ElementRef<HTMLCanvasElement>;

  currentPage: number = 1;
  totalPages: number = 0;
  pdfDoc: any;
  scale: number = 1.5;
  pageRendering: boolean = false;
  currentPosition: { x: number; y: number } | null = null;
  private stampImage!: HTMLImageElement;
  private canvasContext!: CanvasRenderingContext2D;

  constructor() {
    this.loadPdf();
    this.loadStampImage('estampar.png');
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    /* if (changes['pdfUrl']) {
      console.log('Cargo el archivo');
      this.loadPdf();
    } */
    //throw new Error('Method not implemented.');
  }

  async loadPdf() {
    /*  const loadingTask = pdfjsLib.getDocument('path/to/your/pdf/file.pdf');
    this.pdfDoc = await loadingTask.promise;
    this.renderPage(this.pageNum); */

    this.pdfUrl = encodeURI('1723174825.pdf'); // Ruta del archivo PDF
    this.currentPage = 1;
    this.pdfDoc = await pdfjs.getDocument(this.pdfUrl).promise;

    this.totalPages = this.pdfDoc.numPages;
    this.renderPage(this.currentPage);
  }

  async renderPage(num: number) {
    const page = await this.pdfDoc.getPage(num);
    const viewport = page.getViewport({ scale: this.scale });
    const canvas = this.pdfCanvas.nativeElement;
    const context = canvas.getContext('2d')!;
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };
    await page.render(renderContext).promise;

    if (this.currentPosition) {
      this.drawIndicator(this.currentPosition.x, this.currentPosition.y);
    }
  }

  onCanvasClick(event: MouseEvent) {
    const canvas = this.pdfCanvas.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    this.currentPosition = { x, y };
    this.renderPage(this.currentPage);
  }

  drawIndicator(x: number, y: number) {
    const context = this.pdfCanvas.nativeElement.getContext('2d')!;
    const size = 100; // Size of the indicator (e.g., a circle or an image)
    context.beginPath();
    context.arc(x, y, size, 0, 2 * Math.PI, false);
    context.fillStyle = 'red';
    context.fill();
    context.lineWidth = 1;
    context.strokeStyle = '#003300';
    context.stroke();
  }

  loadStampImage(url: string) {
    this.stampImage = new Image();
    this.stampImage.src = url;
    /*  this.stampImage.style.border = 'solid 1px';
    this.stampImage.style.borderColor = 'rgba(0, 0, 0, 0.2)'; */
    this.stampImage.onload = () => {
      console.log('Stamp image loaded');
    };
  }

  onClick(event: MouseEvent) {
    if (!this.stampImage) return;

    const rect = this.pdfCanvas.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const stampWidth = this.stampImage.width / 2; // Ajusta el tamaño según necesites
    const stampHeight = this.stampImage.height / 2; // Ajusta el tamaño según necesites

    this.canvasContext.drawImage(
      this.stampImage,
      x - stampWidth / 2,
      y - stampHeight / 2,
      stampWidth,
      stampHeight
    );
    this.renderPage(this.currentPage);
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
}
