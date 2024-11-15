import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ComponentesMantenimientoComponent } from './componentes/componentesMantenimiento.component';

const routes: Routes = [
  { path: '', component: ComponentesMantenimientoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComponentesMantenimientoRoutingModule {}
