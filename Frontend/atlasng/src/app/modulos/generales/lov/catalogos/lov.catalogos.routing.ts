import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovCatalogosComponent } from './componentes/lov.catalogos.component';

const routes: Routes = [
  {
    path: '', component: LovCatalogosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovCatalogosRoutingModule {}
