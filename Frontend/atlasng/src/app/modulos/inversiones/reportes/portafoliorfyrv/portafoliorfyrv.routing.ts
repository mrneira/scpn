import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PortafolioRfyRvComponent } from './componentes/portafoliorfyrv.component';

const routes: Routes = [
  { path: '', component: PortafolioRfyRvComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortafolioRfyRvRoutingModule {}
