import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovCertificacionComponent } from './componentes/lov.certificacion.component';

const routes: Routes = [
  {
    path: '', component: LovCertificacionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovCertificacionRoutingModule {}
