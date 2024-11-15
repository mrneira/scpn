import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CorreccionOcpComponent } from './componentes/correccionocp.component';

const routes: Routes = [
  { path: '', component: CorreccionOcpComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CorreccionOcpRoutingModule {}
