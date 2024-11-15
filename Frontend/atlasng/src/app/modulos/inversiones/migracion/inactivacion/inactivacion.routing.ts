import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InactivacionComponent } from './componentes/inactivacion.component';

const routes: Routes = [
  { path: '', component: InactivacionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InactivacionRoutingModule {}
