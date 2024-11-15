import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReenvioComponent } from './componentes/reenvio.component';

const routes: Routes = [
  { path: '', component: ReenvioComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReenvioRoutingModule {}
