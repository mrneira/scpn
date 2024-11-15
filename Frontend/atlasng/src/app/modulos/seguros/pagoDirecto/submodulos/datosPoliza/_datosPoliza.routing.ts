import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DatosPolizaComponent } from './componentes/_datosPoliza.component';

const routes: Routes = [
  {
    path: '', component: DatosPolizaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DatosPolizaRoutingModule { }
