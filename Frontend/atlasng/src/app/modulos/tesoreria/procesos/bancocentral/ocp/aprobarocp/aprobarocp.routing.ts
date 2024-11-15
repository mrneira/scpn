import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AprobarOcpComponent } from './componentes/aprobarocp.component';

const routes: Routes = [
  { path: '', component: AprobarOcpComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AprobarOcpRoutingModule {}
