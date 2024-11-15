import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CambioContraseniaComponent } from './componentes/cambioContrasenia.component';

const routes: Routes = [
  { path: '', component: CambioContraseniaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CambioContraseniaRoutingModule {}
