import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConsultaCancelacionCarteraComponent } from './componentes/consultaCancelacionCartera.component';

const routes: Routes = [
  { path: '', component: ConsultaCancelacionCarteraComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultaCancelacionCarteraRoutingModule {}
