import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AutorizarAplicacionComponent } from './componentes/autorizaraplicacion.component';

const routes: Routes = [
  { path: '', component: AutorizarAplicacionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AutorizarAplicacionRoutingModule {}
