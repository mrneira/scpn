import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {CertificacionComponent } from './componentes/certificacion.component';

const routes: Routes = [
  { path: '', component: CertificacionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CertificacionoRoutingModule {}
