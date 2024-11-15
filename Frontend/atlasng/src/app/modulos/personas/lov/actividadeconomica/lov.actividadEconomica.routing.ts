import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovActividadEconomicaComponent } from './componentes/lov.actividadEconomica.component';

const routes: Routes = [
  {
    path: '', component: LovActividadEconomicaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovActividadEconomicaRoutingModule {}
