import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CargaExtractoBancarioBceComponent } from './componentes/cargaextractobancariobce.component';

const routes: Routes = [
  { path: '', component: CargaExtractoBancarioBceComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CargaExtractoBancarioBceRoutingModule {}
