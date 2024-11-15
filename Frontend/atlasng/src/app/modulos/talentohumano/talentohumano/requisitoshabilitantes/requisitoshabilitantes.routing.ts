import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RequisitosHabilitantesComponent } from './componentes/requisitoshabilitantes.component';

const routes: Routes = [
  { 
    path: '', component: RequisitosHabilitantesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequisitosHabilitantesRoutingModule {}
