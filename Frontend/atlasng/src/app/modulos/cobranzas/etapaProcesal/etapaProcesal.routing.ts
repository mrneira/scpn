import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EtapaProcesalComponent } from './componentes/etapaProcesal.component';

const routes: Routes = [
  { path: '', component: EtapaProcesalComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EtapaProcesalRoutingModule {}
