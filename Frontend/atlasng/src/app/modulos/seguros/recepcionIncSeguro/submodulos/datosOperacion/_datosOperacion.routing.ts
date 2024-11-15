import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DatosOperacionComponent } from './componentes/_datosOperacion.component';

const routes: Routes = [
  {
    path: '', component: DatosOperacionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DatosOperacionRoutingModule { }
