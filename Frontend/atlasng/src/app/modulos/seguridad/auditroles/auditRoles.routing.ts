import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuditRolesComponent } from './componentes/auditRoles.component';

const routes: Routes = [
  { path: '', component: AuditRolesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuditRolesRoutingModule {}
