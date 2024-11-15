import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InformacionGeneralComponent } from './componentes/_informacionGeneral.component';

const routes: Routes = [
  { path: '', component: InformacionGeneralComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InformacionGeneralRoutingModule {}
