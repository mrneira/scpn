import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlananualdetalleComponent } from './componentes/plananualdetalle.component';

const routes: Routes = [
  { path: '', component: PlananualdetalleComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortafoliorvRoutingModule {}
