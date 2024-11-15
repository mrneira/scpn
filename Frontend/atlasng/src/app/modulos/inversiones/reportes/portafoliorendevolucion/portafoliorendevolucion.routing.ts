import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PortafoliorendevolucionComponent } from './componentes/portafoliorendevolucion.component';

const routes: Routes = [
  { path: '', component: PortafoliorendevolucionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortafoliordRoutingModule {}
