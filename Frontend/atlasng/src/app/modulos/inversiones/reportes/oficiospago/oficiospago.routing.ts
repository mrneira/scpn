import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OficiospagoComponent } from './componentes/oficiospago.component';

const routes: Routes = [
  { path: '', component: OficiospagoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OficiospagoRoutingModule {}
