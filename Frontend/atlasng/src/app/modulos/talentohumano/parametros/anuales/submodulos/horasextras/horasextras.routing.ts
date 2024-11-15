import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HorasExtrasComponent } from './componentes/horasextras.component';

const routes: Routes = [
  { path: '', component: HorasExtrasComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HorasextrasRoutingModule {}
