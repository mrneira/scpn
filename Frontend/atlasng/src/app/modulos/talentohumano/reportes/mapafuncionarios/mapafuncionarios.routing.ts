import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MapaFuncionariosComponent } from './componentes/mapafuncionarios.component';

const routes: Routes = [
  { path: '', component: MapaFuncionariosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MapaFuncionariosRoutingModule {}
