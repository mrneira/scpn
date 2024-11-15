import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AnularCompromisoComponent } from './componentes/anularcompromiso.component';

const routes: Routes = [
  { path: '', component: AnularCompromisoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnularCompromisoRoutingModule {}
