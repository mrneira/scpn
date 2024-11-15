import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PortafoliorfemisorComponent } from './componentes/portafoliorfemisor.component';

const routes: Routes = [
  { path: '', component: PortafoliorfemisorComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortafoliorfemisorRoutingModule {}
