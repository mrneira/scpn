import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TasaactuarialComponent } from './componentes/tasaactuarial.component';

const routes: Routes = [
  { path: '', component: TasaactuarialComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParametrosRoutingModule {}
