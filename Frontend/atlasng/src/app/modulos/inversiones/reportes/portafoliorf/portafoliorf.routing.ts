import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PortafoliorfComponent } from './componentes/portafoliorf.component';

const routes: Routes = [
  { path: '', component: PortafoliorfComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortafoliorfRoutingModule {}
