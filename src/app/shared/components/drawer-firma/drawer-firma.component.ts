import {
  Component,
  Input,
  ElementRef,
  AfterViewInit,
  ViewChild,
  OnDestroy,
  HostListener,
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
  private isScrollLocked = true;

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
    const touchStart$ = fromEvent(canvasEl, 'touchstart');
    const mouseMove$ = fromEvent(canvasEl, 'mousemove');
    const touchMove$ = fromEvent(canvasEl, 'touchmove');
    const mouseUp$ = fromEvent(document, 'mouseup');
    const touchEnd$ = fromEvent(document, 'touchend');

    const drawing$ = mouseDown$.pipe(
      switchMap((startEvent) => {
        return mouseMove$.pipe(
          takeUntil(mouseUp$),
          takeUntil(touchEnd$),
          takeUntil(fromEvent(document, 'mouseleave')),
          pairwise()
        );
      })
    );

    const touchDrawing$ = touchStart$.pipe(
      switchMap((startEvent) => {
        return touchMove$.pipe(
          takeUntil(touchEnd$),
          takeUntil(fromEvent(document, 'touchcancel')),
          pairwise()
        );
      })
    );

    const subscription = drawing$.subscribe(([prevEvent, currentEvent]) => {
      if (!this.isScrollLocked) {
        this.handleDrawEvent(canvasEl, prevEvent, currentEvent);
      }
    });

    const touchSubscription = touchDrawing$.subscribe(
      ([prevEvent, currentEvent]) => {
        if (!this.isScrollLocked) {
          this.handleDrawEvent(canvasEl, prevEvent, currentEvent);
        }
      }
    );

    this.subscriptions.push(subscription, touchSubscription);
  }

  private handleDrawEvent(
    canvasEl: HTMLCanvasElement,
    prevEvent: Event,
    currentEvent: Event
  ) {
    const rect = canvasEl.getBoundingClientRect();

    const prevPos = this.getEventPosition(prevEvent, rect);
    const currentPos = this.getEventPosition(currentEvent, rect);

    this.drawOnCanvas(prevPos, currentPos);
  }

  private getEventPosition(
    event: Event,
    rect: DOMRect
  ): { x: number; y: number } {
    if (event instanceof MouseEvent) {
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    } else if (event instanceof TouchEvent) {
      const touch = event.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    }
    return { x: 0, y: 0 };
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

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    if (event.touches.length === 1) {
      this.isScrollLocked = true;
    }
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove(event: TouchEvent) {
    if (this.isScrollLocked && event.touches.length === 1) {
      event.preventDefault();
    }
  }

  @HostListener('touchend')
  onTouchEnd() {
    this.isScrollLocked = false;
  }
}
