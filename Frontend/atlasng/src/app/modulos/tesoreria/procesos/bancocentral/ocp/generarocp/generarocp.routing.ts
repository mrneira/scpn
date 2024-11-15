import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GenerarOcpComponent } from './componentes/generarocp.component';

const routes: Routes = [
  { path: '', component: GenerarOcpComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GenerarOcpRoutingModule {}
