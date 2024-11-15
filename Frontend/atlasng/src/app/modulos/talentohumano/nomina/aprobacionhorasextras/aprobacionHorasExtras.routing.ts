import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AprobacionHorasExtrasComponent } from './componentes/aprobacionHorasExtras.component';

const routes: Routes = [
  { path: '', component: AprobacionHorasExtrasComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AprobacionHorasExtrasRoutingModule {}
