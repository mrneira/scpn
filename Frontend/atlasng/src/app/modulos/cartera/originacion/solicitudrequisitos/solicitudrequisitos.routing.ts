import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SolicitudRequisitosComponent } from './componentes/solicitudrequisitos.component';

const routes: Routes = [
  { path: '', component: SolicitudRequisitosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SolicitudRequisitosRoutingModule {}
