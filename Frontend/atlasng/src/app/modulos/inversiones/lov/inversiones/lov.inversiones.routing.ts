import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovInversionesComponent } from './componentes/lov.inversiones.component';

const routes: Routes = [
  {
    path: '', component: LovInversionesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovInversionesRoutingModule {}