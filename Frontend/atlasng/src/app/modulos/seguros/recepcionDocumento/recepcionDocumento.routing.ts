import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecepcionDocumentoComponent } from './componentes/recepcionDocumento.component';

const routes: Routes = [
  {
    path: '', component: RecepcionDocumentoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecepcionDocumentoRoutingModule { }
