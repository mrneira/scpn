import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovDefaultComponent } from './componentes/lov.default.component';

const routes: Routes = [
  {
    path: '', component: LovDefaultComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovDefaultRoutingModule {}