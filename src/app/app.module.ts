import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DrawerFirmaComponent } from './shared/components/drawer-firma/drawer-firma.component';
import { DrawerFirma2Component } from './shared/components/drawer-firma2/drawer-firma2.component';

@NgModule({
  declarations: [
    AppComponent,
    DrawerFirmaComponent,
    DrawerFirma2Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
