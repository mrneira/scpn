import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FrecuenciasComponent } from './componentes/frecuencias.component';

const routes: Routes = [
  { path: '', component: FrecuenciasComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrecuenciasRoutingModule {}
