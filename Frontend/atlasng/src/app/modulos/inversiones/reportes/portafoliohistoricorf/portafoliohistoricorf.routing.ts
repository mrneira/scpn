import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PortafoliohistoricorfComponent } from './componentes/portafoliohistoricorf.component';

const routes: Routes = [
  { path: '', component:PortafoliohistoricorfComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortafoliohistoricorfRoutingModule {}
