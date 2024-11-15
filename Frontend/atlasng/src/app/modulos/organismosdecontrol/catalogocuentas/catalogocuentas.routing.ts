import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CatalogocuentasComponent } from './componentes/catalogocuentas.component';

const routes: Routes = [
  { path: '', component: CatalogocuentasComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogocuentasRoutingModule {}
