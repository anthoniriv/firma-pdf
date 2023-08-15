import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawerFirma2Component } from './drawer-firma2.component';

describe('DrawerFirma2Component', () => {
  let component: DrawerFirma2Component;
  let fixture: ComponentFixture<DrawerFirma2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrawerFirma2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrawerFirma2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
