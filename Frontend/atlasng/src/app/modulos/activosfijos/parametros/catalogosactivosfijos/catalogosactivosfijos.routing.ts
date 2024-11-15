import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CatalogosActivosfijosComponent } from './componentes/catalogosactivosfijos.component';

const routes: Routes = [
  { path: '', component: CatalogosActivosfijosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogosActivosfijosRoutingModule {}
