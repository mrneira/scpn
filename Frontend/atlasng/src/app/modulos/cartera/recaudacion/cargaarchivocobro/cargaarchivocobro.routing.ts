import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CargaArchivoCobroComponent } from './componentes/cargaarchivocobro.component';

const routes: Routes = [
  { path: '', component: CargaArchivoCobroComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CargaArchivoCobroRoutingModule {}
