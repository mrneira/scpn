import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovOperacionCobranzaComponent } from './componentes/lov.operacionCobranza.component';

const routes: Routes = [
  {
    path: '', component: LovOperacionCobranzaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovOperacionCobranzaRoutingModule {}
