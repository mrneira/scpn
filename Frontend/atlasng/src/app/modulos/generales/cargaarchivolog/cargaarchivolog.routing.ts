import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CargaArchivoLogComponent } from './componentes/cargaarchivolog.component';

const routes: Routes = [
  { path: '', component: CargaArchivoLogComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CargaArchivoLogRoutingModule {}
