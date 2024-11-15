import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DefinicionTareasComponent } from './componentes/definicionTareas.component';

const routes: Routes = [
  { path: '', component: DefinicionTareasComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DefinicionTareasRoutingModule {}
