import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TipoGradoComponent } from './componentes/tipoGrado.component';

const routes: Routes = [
  { path: '', component: TipoGradoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TipoGradoRoutingModule {}
