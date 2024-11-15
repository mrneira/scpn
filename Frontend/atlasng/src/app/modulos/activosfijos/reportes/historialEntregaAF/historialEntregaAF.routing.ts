import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HistorialEntregaAFComponent } from './componentes/historialEntregaAF.component';

const routes: Routes = [
  { path: '', component: HistorialEntregaAFComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HistorialEntregaAFRoutingModule {}
