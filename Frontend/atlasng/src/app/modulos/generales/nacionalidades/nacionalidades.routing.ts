import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NacionalidadesComponent } from './componentes/nacionalidades.component';

const routes: Routes = [
  { path: '', component: NacionalidadesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NacionalidadesRoutingModule {}
