import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovContabilizacionComponent } from './componentes/lov.contabilizacion.component';

const routes: Routes = [
  {
    path: '', component: LovContabilizacionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovContabilizacionRoutingModule {}