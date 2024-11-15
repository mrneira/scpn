import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReprocesarArchivoSpiComponent } from './componentes/reprocesararchivospi.component';

const routes: Routes = [
  { path: '', component: ReprocesarArchivoSpiComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReprocesarArchivoSpiRoutingModule {}
