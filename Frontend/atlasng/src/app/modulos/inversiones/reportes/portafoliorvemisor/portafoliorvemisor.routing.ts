import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PortafoliorvEmisorComponent } from './componentes/portafoliorvemisor.component';

const routes: Routes = [
  { path: '', component: PortafoliorvEmisorComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortafoliorvEmisorRoutingModule {}
