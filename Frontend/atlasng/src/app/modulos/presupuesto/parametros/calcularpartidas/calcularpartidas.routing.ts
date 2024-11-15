import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CalcularPartidasComponent } from './componentes/calcularpartidas.component';

const routes: Routes = [
  { path: '', component: CalcularPartidasComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CalcularPartidasRoutingModule {}
