import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CargamayorComponent } from './componentes/cargamayor.component';

const routes: Routes = [
  { path: '', component: CargamayorComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CargamayorRoutingModule {}
