import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InternaDetalleComponent } from './componentes/internadetalle.component';

const routes: Routes = [
  { path: '', component: InternaDetalleComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IntrnaDetalleRoutingModule {}
