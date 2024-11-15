import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SolicitudPermisoComponent } from './componentes/solicitudpermiso.component';

const routes: Routes = [
  { path: '', component: SolicitudPermisoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SolicitudPermisoRoutingModule {}
