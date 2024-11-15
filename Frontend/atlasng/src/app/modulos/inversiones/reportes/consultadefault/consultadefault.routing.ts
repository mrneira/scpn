import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConsultadefaultComponent } from './componentes/consultadefault.component';

const routes: Routes = [
  { path: '', component: ConsultadefaultComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultadefaultRoutingModule {}
