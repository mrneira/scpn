import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CertificadoCarteraComponent } from './componentes/certificadoCartera.component';

const routes: Routes = [
  {
    path: '', component: CertificadoCarteraComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CertificadoCarteraRoutingModule { }
