import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AvaluoComponent } from './componentes/_avaluo.component';

const routes: Routes = [
  { path: '', component: AvaluoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AvaluoRoutingModule {}
