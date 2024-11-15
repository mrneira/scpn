import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EncerarContraseniaComponent } from './componentes/encerarContrasenia.component';

const routes: Routes = [
  { path: '', component: EncerarContraseniaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EncerarContraseniaRoutingModule {}
