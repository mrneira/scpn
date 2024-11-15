import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OperadorinstComponent } from './componentes/operadorinst.component';

const routes: Routes = [
  { path: '', component: OperadorinstComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperadorinstRoutingModule {}
