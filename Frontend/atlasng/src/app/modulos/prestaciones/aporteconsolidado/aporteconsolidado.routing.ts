import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AporteConsolidadoComponent } from './componentes/aporteconsolidado.component';

const routes: Routes = [
  { path: '', component: AporteConsolidadoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AporteConsolidadoRoutingModule {}
