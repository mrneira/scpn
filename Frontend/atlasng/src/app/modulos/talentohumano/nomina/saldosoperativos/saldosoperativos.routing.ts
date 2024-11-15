import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SaldosOperativoComponent } from './componentes/saldosoperativos.component';

const routes: Routes = [
  { path: '', component: SaldosOperativoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SaldosOperativoRoutingModule {}
