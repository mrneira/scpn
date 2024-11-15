import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SecuenciasComponent } from './componentes/secuencias.component';

const routes: Routes = [
  { path: '', component: SecuenciasComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecuenciasRoutingModule {}
