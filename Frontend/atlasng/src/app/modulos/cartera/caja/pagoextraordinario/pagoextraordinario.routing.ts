import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagoExtraordinarioComponent } from './componentes/pagoextraordinario.component';

const routes: Routes = [
  { path: '', component: PagoExtraordinarioComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagoExtraordinarioRoutingModule {}
