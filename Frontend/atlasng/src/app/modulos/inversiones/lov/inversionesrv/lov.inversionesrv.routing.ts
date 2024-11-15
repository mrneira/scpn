import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovInversionesrvComponent } from './componentes/lov.inversionesrv.component';

const routes: Routes = [
  {
    path: '', component: LovInversionesrvComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovInversionesrvRoutingModule {}