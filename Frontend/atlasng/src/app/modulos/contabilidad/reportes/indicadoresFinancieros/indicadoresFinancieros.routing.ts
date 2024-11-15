import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IndicadoresFinancierosComponent } from './componentes/indicadoresFinancieros.component';

const routes: Routes = [
  { path: '', component: IndicadoresFinancierosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndicadoresFinancierosRoutingModule {}