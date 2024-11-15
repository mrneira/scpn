import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IngresoGarComponent } from './componentes/ingresoGar.component';

const routes: Routes = [
  { path: '', component: IngresoGarComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IngresoGarRoutingModule {}
