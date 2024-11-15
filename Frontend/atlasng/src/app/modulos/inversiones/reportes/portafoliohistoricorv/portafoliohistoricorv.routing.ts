import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PortafoliohistoricorvComponent } from './componentes/portafoliohistoricorv.component';

const routes: Routes = [
  { path: '', component:PortafoliohistoricorvComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortafoliohistoricorvRoutingModule {}
