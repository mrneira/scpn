import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FacturasParqueaderosComponent } from './componentes/facturasParqueaderos.component';

const routes: Routes = [
  { path: '', component: FacturasParqueaderosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacturasParqueaderosRoutingModule {}
