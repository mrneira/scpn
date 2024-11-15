import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IngresosComponent } from './componentes/_ingresos.component';

const routes: Routes = [
  { path: '', component: IngresosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IngresosRoutingModule {}
