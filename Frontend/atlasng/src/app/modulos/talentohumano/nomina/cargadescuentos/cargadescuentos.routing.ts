import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CargadescuentosComponent } from './componentes/cargadescuentos.component';

const routes: Routes = [
  { path: '', component: CargadescuentosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CargadescuentosRoutingModule {}
