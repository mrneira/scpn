import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SancionPonderacionComponent } from './componentes/sancionPonderacion.component';

const routes: Routes = [
  { path: '', component: SancionPonderacionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SancionPonderacionRoutingModule {}
