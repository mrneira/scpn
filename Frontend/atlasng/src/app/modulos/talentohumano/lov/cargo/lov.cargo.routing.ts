import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovCargoComponent } from './componentes/lov.cargo.component';

const routes: Routes = [
  {
    path: '', component: LovCargoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovCargoRoutingModule {}
