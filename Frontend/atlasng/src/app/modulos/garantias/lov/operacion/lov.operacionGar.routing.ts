import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovOperacionGarComponent } from './componentes/lov.operacionGar.component';

const routes: Routes = [
  {
    path: '', component: LovOperacionGarComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovOperacionGarRoutingModule {}
