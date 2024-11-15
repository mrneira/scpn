import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuditGeneralComponent } from './componentes/auditGeneral.component';

const routes: Routes = [
  { path: '', component: AuditGeneralComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuditGeneralRoutingModule {}
