import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SegmentosComponent } from './componentes/segmentos.component';

const routes: Routes = [
  { path: '', component: SegmentosComponent,
  }
];
 
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SegmentosRoutingModule {}
