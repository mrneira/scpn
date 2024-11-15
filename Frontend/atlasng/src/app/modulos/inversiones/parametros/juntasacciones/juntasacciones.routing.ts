import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JuntasaccionesComponent } from './componentes/juntasacciones.component';

const routes: Routes = [
  { path: '', component: JuntasaccionesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JuntasaccionesRoutingModule {}
