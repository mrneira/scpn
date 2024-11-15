import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CargaMasivaFPCComponent } from './componentes/cargamasivafpc.component';

const routes: Routes = [
  { path: '', component: CargaMasivaFPCComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CargaMasivaFPCRoutingModule {}
