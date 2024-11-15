import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovModuloTareasComponent } from './componentes/lov.moduloTareas.component';

const routes: Routes = [
  {
    path: '', component: LovModuloTareasComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovModuloTareasRoutingModule {}
