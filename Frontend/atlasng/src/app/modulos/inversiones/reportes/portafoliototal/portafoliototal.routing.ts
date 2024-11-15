import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PortafolioTotalComponent } from './componentes/portafoliototal.component';

const routes: Routes = [
  { path: '', component:PortafolioTotalComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortafolioTotalRoutingModule {}
