import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagoContableComponent } from './componentes/pagocontable.component';

const routes: Routes = [
  { path: '', component: PagoContableComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagoContableRoutingModule {}
