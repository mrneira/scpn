import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoteResultadoCabeceraComponent } from './componentes/_loteResultadoCabecera.component';

const routes: Routes = [
  { path: '', component: LoteResultadoCabeceraComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoteResultadoCabeceraRoutingModule {}
