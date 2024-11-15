import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HorasextrasComponent } from './componentes/horasextras.component';

const routes: Routes = [
  { path: '', component: HorasextrasComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HorasextrasRoutingModule {}
