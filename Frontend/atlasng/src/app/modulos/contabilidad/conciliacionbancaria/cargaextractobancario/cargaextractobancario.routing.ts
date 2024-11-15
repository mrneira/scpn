import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CargaextractobancarioComponent } from './componentes/cargaextractobancario.component';

const routes: Routes = [
  { path: '', component: CargaextractobancarioComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CargaextractobancarioRoutingModule {}
