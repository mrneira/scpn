import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaisesComponent } from './componentes/paises.component';

const routes: Routes = [
  { path: '', component: PaisesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaisesRoutingModule {}
