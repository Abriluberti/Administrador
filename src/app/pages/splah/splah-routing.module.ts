import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SplahPage } from './splah.page';

const routes: Routes = [
  {
    path: '',
    component: SplahPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SplahPageRoutingModule {}
