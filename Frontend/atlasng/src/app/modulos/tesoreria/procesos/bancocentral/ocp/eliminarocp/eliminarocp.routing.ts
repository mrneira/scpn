import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EliminarOcpComponent } from './componentes/eliminarocp.component';

const routes: Routes = [
  { path: '', component: EliminarOcpComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EliminarOcpRoutingModule {}
