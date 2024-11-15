import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AutorizarModificacionSpiComponent } from './componentes/autorizarmodificacionspi.component';

const routes: Routes = [
  { path: '', component: AutorizarModificacionSpiComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AutorizarModificacionSpiRoutingModule {}
