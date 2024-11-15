import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConstantesComponent } from './componentes/constantes.component';

const routes: Routes = [
  { path: '', component: ConstantesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConstantesRoutingModule {}
