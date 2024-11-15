import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActividadesEconomicasComponent } from './componentes/actividadesEconomicas.component';

const routes: Routes = [
  { path: '', component: ActividadesEconomicasComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActividadesEconomicasRoutingModule {}
