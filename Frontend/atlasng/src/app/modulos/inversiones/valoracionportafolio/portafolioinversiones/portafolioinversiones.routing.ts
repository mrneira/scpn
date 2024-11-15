import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PortafolioinversionesComponent } from './componentes/portafolioinversiones.component';

const routes: Routes = [
  { path: '', component: PortafolioinversionesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortafolioinversionesRoutingModule {}
