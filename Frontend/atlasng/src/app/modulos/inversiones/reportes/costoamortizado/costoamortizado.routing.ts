import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CostoAmortizadoComponent } from './componentes/costoamortizado.component';

const routes: Routes = [
  { path: '', component: CostoAmortizadoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CostoAmortizadoRoutingModule {}
