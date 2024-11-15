import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CierrePeriodoContableComponent } from './componentes/cierreperiodocontable.component';

const routes: Routes = [
  { path: '', component: CierrePeriodoContableComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CierrePeriodoContableRoutingModule {}
