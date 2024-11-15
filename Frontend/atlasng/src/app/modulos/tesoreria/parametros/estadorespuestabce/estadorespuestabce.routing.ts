import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EstadoRespuestaBceComponent } from './componentes/estadorespuestabce.component';

const routes: Routes = [
  { path: '', component: EstadoRespuestaBceComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstadoRespuestaBceRoutingModule {}
