import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CargaArchivosBIComponent } from './componentes/cargaArchivosBI.component';

const routes: Routes = [
  { path: '', component: CargaArchivosBIComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CargaArchivosBIRoutingModule {}
