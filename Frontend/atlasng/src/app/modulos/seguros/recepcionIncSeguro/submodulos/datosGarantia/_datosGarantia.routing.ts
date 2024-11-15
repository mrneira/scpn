import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DatosGarantiaComponent } from './componentes/_datosGarantia.component';

const routes: Routes = [
  {
    path: '', component: DatosGarantiaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DatosGarantiaRoutingModule { }
