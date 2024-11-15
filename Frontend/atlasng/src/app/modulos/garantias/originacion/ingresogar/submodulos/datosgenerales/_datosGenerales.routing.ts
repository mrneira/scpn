import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DatosGeneralesComponent } from './componentes/_datosGenerales.component';

const routes: Routes = [
  { path: '', component: DatosGeneralesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DatosGeneralesRoutingModule {}
