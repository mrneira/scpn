import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GastosPersonalesComponent } from './componentes/gastosPersonales.component';

const routes: Routes = [
  { path: '', component: GastosPersonalesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GastosPersonalesRoutingModule {}
