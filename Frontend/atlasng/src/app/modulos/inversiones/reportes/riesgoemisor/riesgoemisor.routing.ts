import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RiesgoemisorComponent } from './componentes/riesgoemisor.component';

const routes: Routes = [
  { path: '', component: RiesgoemisorComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RiesgoemisorRoutingModule {}
