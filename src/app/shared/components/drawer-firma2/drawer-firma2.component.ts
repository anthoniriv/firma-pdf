import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Renderer2,
} from '@angular/core';
import SignaturePad from 'signature_pad';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-drawer-firma2',
  templateUrl: './drawer-firma2.component.html',
  styleUrls: ['./drawer-firma2.component.scss'],
})
export class DrawerFirma2Component {
  @ViewChild('signaturePad', { static: true }) signaturePadElement!: ElementRef;

  signaturePad: any;
  isDrawing = false;

  isConfirmed = false;
  signatureImage: string | null = null;

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    this.signaturePad = new SignaturePad(
      this.signaturePadElement.nativeElement
    );
  }

  startDrawing() {
    this.isDrawing = true;
    this.renderer.addClass(document.body, 'no-scroll');
  }

  endDrawing() {
    this.isDrawing = false;
    this.renderer.removeClass(document.body, 'no-scroll');
  }

  confirmSignature() {
    if (this.signaturePad.isEmpty()) {
      alert('Por favor, firme antes de confirmar.');
      return;
    }
    this.signatureImage = this.signaturePad.toDataURL(); // Convertir firma a imagen
    this.isConfirmed = true;
    this.downloadPDF();
  }

  public downloadPDF(): void {
    const doc = new jsPDF();

    doc.text('Hello world!', 10, 10);

    // Agregar imagen desde base64
    const imgData = this.signatureImage; // Asigna aquí el valor de this.signatureImage
    const imgWidth = 50; // Ancho de la imagen en el PDF
    const imgHeight = 50; // Alto de la imagen en el PDF
    doc.addImage(imgData!, 'JPEG', 10, 20, imgWidth, imgHeight);

    doc.save('hello-world.pdf');
  }

  clearSignature() {
    this.signaturePad.clear();
  }
}
