import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovCatalogosDetalleComponent } from './componentes/lov.catalogosDetalle.component';

const routes: Routes = [
  {
    path: '', component: LovCatalogosDetalleComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovCatalogosDetalleRoutingModule {}
