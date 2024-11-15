import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PortafoliorvComponent } from './componentes/portafoliorv.component';

const routes: Routes = [
  { path: '', component: PortafoliorvComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortafoliorvRoutingModule {}
