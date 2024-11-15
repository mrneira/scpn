import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuditUsuarioComponent } from './componentes/auditUsuario.component';

const routes: Routes = [
  { path: '', component: AuditUsuarioComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuditUsuarioRoutingModule {}
