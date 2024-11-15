import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EstatusOperacionComponent } from './componentes/estatusOperacion.component';

const routes: Routes = [
  { path: '', component: EstatusOperacionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstatusOperacionRoutingModule {}
