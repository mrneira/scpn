import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BajaGarComponent } from './componentes/bajaGar.component';

const routes: Routes = [
  { path: '', component: BajaGarComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BajaGarRoutingModule {}
