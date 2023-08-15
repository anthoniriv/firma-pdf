import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawerFirmaComponent } from './drawer-firma.component';

describe('DrawerFirmaComponent', () => {
  let component: DrawerFirmaComponent;
  let fixture: ComponentFixture<DrawerFirmaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrawerFirmaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrawerFirmaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
