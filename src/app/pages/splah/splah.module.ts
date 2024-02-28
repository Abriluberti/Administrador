import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SplahPageRoutingModule } from './splah-routing.module';

import { SplahPage } from './splah.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SplahPageRoutingModule
  ],
  declarations: [SplahPage]
})
export class SplahPageModule {}
