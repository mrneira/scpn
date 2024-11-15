import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CargaArchivosFRComponent } from './componentes/cargaarchivofondosreserva.component';

const routes: Routes = [
  { path: '', component: CargaArchivosFRComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CargaArchivosFRRoutingModule {}
