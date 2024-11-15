import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CargaArchivosComponent } from './componentes/cargaArchivos.component';

const routes: Routes = [
  { path: '', component: CargaArchivosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CargaArchivosRoutingModule {}
