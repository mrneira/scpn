import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AprobacionAtrasosComponent } from './componentes/aprobacionatrasos.component';

const routes: Routes = [
  { path: '', component: AprobacionAtrasosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AprobacionAtrasosRoutingModule {}
