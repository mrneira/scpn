import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CamposGarantiasComponent } from './componentes/camposGarantias.component';

const routes: Routes = [
  { path: '', component: CamposGarantiasComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CamposGarantiasRoutingModule {}
