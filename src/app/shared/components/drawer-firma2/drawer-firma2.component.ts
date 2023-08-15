import { Component, ViewChild, ElementRef, AfterViewInit, Renderer2 } from '@angular/core';
import SignaturePad from 'signature_pad';

@Component({
  selector: 'app-drawer-firma2',
  templateUrl: './drawer-firma2.component.html',
  styleUrls: ['./drawer-firma2.component.scss'],
})
export class DrawerFirma2Component {
  @ViewChild('signaturePad', { static: true }) signaturePadElement!: ElementRef;

  signaturePad: any;
  isDrawing = false;

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

  clearSignature() {
    this.signaturePad.clear();
  }
}
