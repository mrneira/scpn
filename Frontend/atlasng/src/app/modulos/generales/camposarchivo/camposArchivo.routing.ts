import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CamposArchivoComponent } from './componentes/camposArchivo.component';

const routes: Routes = [
  { path: '', component: CamposArchivoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CamposArchivoRoutingModule {}
