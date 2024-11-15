import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ValVencidosComponent } from './componentes/_valVencidos.component';

const routes: Routes = [
  { path: '', component: ValVencidosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ValVencidosRoutingRouting {}
