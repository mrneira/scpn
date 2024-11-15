import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CargaArchivoCashComponent } from './componentes/cargaarchivocash.component';

const routes: Routes = [
  { path: '', component: CargaArchivoCashComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CargaArchivoCashRoutingModule {}
