import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CambioContraseniaLoginComponent } from './componentes/cambioContraseniaLogin.component';

const routes: Routes = [
  { path: '', component: CambioContraseniaLoginComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CambioContraseniaLoginRoutingModule {}
