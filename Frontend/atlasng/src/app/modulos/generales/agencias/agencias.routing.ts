import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgenciasComponent } from './componentes/agencias.component';

const routes: Routes = [
  { path: '', component: AgenciasComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgenciasRoutingModule {}
