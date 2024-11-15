import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReprocesarArchivOcpComponent } from './componentes/reprocesararchivocp.component';

const routes: Routes = [
  { path: '', component: ReprocesarArchivOcpComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReprocesarArchivOcpRoutingModule {}
