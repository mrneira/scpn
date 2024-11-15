import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContabilizacionProvisionesComponent } from './componentes/contabilizacionProvisiones.component';

const routes: Routes = [
  { path: '', component: ContabilizacionProvisionesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContabilizacionProvisionesRoutingModule {}
