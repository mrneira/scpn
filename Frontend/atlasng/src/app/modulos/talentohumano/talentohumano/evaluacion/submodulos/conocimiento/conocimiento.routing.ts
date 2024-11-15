import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConocimientoComponent } from './conocimiento/conocimiento.component'

const routes: Routes = [
  { path: '', component: ConocimientoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConocimientoRoutingModule {}
