import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SbsComponent } from './componentes/sbs.component';

const routes: Routes = [
  { path: '', component: SbsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SbsRoutingModule {}
