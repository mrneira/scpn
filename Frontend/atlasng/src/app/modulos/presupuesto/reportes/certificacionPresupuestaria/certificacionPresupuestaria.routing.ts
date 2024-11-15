import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CertificacionPresupuestariaComponent } from './componentes/certificacionPresupuestaria.component';

const routes: Routes = [
  { path: '', component: CertificacionPresupuestariaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CertificacionPresupuestariaRoutingModule {}
