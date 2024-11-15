import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CobromigradasComponent } from './componentes/cobromigradas.component';

const routes: Routes = [
  { path: '', component: CobromigradasComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CobromigradasRoutingModule {}
