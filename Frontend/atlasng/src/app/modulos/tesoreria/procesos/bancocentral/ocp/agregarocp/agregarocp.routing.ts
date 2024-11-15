import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgregarOcpComponent } from './componentes/agregarocp.component';

const routes: Routes = [
  { path: '', component: AgregarOcpComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgregarOcpRoutingModule {}
