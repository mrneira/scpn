import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AcumulacionesComponent } from './componentes/acumulaciones.component';

const routes: Routes = [
  { path: '', component: AcumulacionesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AcumulacionesRoutingModule {}
