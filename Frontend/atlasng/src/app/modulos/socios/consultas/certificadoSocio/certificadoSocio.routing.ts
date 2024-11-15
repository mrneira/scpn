import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CertificadoSocioComponent } from './componentes/certificadoSocio.component';

const routes: Routes = [
  {
    path: '', component: CertificadoSocioComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CertificadoSocioRoutingModule { }
