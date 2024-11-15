import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CargaMasivaFPComponent } from './componentes/cargamasivafp.component';

const routes: Routes = [
  { path: '', component: CargaMasivaFPComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CargaMasivaFPRoutingModule {}
