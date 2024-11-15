import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovTablaamortizacionComponent } from './componentes/lov.tablaamortizacion.component';

const routes: Routes = [
  {
    path: '', component: LovTablaamortizacionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovTablaamortizacionRoutingModule {}