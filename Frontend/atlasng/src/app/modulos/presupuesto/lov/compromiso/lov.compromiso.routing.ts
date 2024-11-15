import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovCompromisoComponent } from './componentes/lov.compromiso.component';

const routes: Routes = [
  {
    path: '', component: LovCompromisoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovCompromisoRoutingModule {}
