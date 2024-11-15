import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExtractoComponent } from './componentes/extracto.component';

const routes: Routes = [
  { path: '', component: ExtractoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExtractoRoutingModule {}
