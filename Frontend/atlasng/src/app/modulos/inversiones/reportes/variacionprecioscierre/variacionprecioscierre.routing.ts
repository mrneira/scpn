import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VariacionCierreComponent } from './componentes/variacionprecioscierre.component';

const routes: Routes = [
  { path: '', component: VariacionCierreComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VariacionCierreRoutingModule {}
