import {
  Component,
  Input,
  ElementRef,
  AfterViewInit,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { switchMap, takeUntil, pairwise } from 'rxjs/operators';

@Component({
  selector: 'app-drawer-firma',
  template: '<canvas #canvas></canvas>',
  styles: ['canvas { border: 1px solid #000; }'],
})
export class DrawerFirmaComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') public canvas!: ElementRef<HTMLCanvasElement>;

  @Input() public width = 400;
  @Input() public height = 400;

  private cx: CanvasRenderingContext2D | null = null;
  private subscriptions: Subscription[] = [];

  public ngAfterViewInit() {
    const canvasEl = this.canvas.nativeElement;
    this.cx = canvasEl.getContext('2d');

    canvasEl.width = this.width;
    canvasEl.height = this.height;

    this.cx!.lineWidth = 3;
    this.cx!.lineCap = 'round';
    this.cx!.strokeStyle = '#000';

    this.captureEvents(canvasEl);
  }

  private captureEvents(canvasEl: HTMLCanvasElement) {
    const mouseDown$ = fromEvent(canvasEl, 'mousedown');
    const mouseMove$ = fromEvent(canvasEl, 'mousemove');
    const mouseUp$ = fromEvent(document, 'mouseup');
    const mouseLeave$ = fromEvent(canvasEl, 'mouseleave');

    const drawing$ = mouseDown$.pipe(
      switchMap((e) => {
        return mouseMove$.pipe(
          takeUntil(mouseUp$),
          takeUntil(mouseLeave$),
          pairwise()
        );
      })
    );

    const subscription = drawing$.subscribe(([prevEvent, currentEvent]) => {
      const rect = canvasEl.getBoundingClientRect();

      const prevPos = {
        x: (prevEvent as MouseEvent).clientX - rect.left,
        y: (prevEvent as MouseEvent).clientY - rect.top,
      };

      const currentPos = {
        x: (currentEvent as MouseEvent).clientX - rect.left,
        y: (currentEvent as MouseEvent).clientY - rect.top,
      };

      this.drawOnCanvas(prevPos, currentPos);
    });

    this.subscriptions.push(subscription);
  }

  private drawOnCanvas(
    prevPos: { x: number; y: number },
    currentPos: { x: number; y: number }
  ) {
    if (!this.cx) {
      return;
    }

    this.cx.beginPath();

    if (prevPos) {
      this.cx.moveTo(prevPos.x, prevPos.y);
      this.cx.lineTo(currentPos.x, currentPos.y);
      this.cx.stroke();
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
