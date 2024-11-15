import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SectoresEconomicosComponent } from './componentes/sectoresEconomicos.component';

const routes: Routes = [
  { path: '', component: SectoresEconomicosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SectoresEconomicosRoutingModule {}
