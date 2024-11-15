import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecuperacionComponent } from './componentes/recuperacion.component';

const routes: Routes = [
  { path: '', component: RecuperacionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecuperacionRoutingModule {}
