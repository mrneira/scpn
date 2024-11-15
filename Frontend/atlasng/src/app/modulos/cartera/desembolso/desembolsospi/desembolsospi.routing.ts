import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DesembolsoSpiComponent } from './componentes/desembolsospi.component';

const routes: Routes = [
  {
    path: '', component: DesembolsoSpiComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DesembolsoSpiRoutingModule { }
