import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ComponentesConsultaComponent } from './componentes/componentesConsulta.component';

const routes: Routes = [
  { path: '', component: ComponentesConsultaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComponentesConsultaRoutingModule {}
