import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EnlaceCuentaClasificadorComponent } from './componentes/enlaceCuentaClasificador.component';

const routes: Routes = [
  { path: '', component: EnlaceCuentaClasificadorComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EnlaceCuentaClasificadorRoutingModule {}
