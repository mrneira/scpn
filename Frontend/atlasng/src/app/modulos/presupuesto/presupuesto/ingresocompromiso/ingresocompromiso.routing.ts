import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IngresoCompromisoComponent } from '../ingresocompromiso/componentes/ingresocompromiso.component';

const routes: Routes = [
  { path: '', component: IngresoCompromisoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IngresoCompromisoRoutingModule {}
