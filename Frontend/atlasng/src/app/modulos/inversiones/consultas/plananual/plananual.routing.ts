import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {PlanAnualComponent} from './componentes/plananual.component';

const routes: Routes = [
  { path: '', component: PlanAnualComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanAnualRoutingModule {}
