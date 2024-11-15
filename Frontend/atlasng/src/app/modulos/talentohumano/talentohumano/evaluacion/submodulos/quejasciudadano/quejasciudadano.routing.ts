import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuejasciudadanoComponent } from './componentes/quejasciudadano.component';

const routes: Routes = [
  { path: '', component: QuejasciudadanoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuejasciudadanoRoutingModule {}
