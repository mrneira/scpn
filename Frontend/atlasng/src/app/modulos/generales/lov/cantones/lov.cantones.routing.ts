import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovCantonesComponent } from './componentes/lov.cantones.component';

const routes: Routes = [
  {
    path: '', component: LovCantonesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovCantonesRoutingModule {}
