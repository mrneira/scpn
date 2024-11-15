import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagoInstitucionesComponent } from './componentes/pagoInstituciones.component';

const routes: Routes = [
  { path: '', component: PagoInstitucionesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagoInstitucionesRoutingModule {}
