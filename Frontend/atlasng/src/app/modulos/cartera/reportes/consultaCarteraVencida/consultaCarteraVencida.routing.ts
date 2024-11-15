import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConsultaCarteraVencidaComponent } from './componentes/consultaCarteraVencida.component';

const routes: Routes = [
  { path: '', component: ConsultaCarteraVencidaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultaCarteraVencidaRoutingModule {}
