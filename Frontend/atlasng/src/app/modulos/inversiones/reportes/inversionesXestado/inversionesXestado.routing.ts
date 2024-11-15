import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InversionesXestadoComponent } from './componentes/inversionesXestado.component';

const routes: Routes = [
  { path: '', component: InversionesXestadoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InversionesXestadoRoutingModule {}
