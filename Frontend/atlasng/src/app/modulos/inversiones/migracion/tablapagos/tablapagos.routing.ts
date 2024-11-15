import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TablapagosComponent } from './componentes/tablapagos.component';

const routes: Routes = [
  { path: '', component: TablapagosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TablapagosRoutingModule {}
