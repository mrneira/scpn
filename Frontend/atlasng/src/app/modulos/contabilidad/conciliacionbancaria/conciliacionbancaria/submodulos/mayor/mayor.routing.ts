import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MayorComponent } from './componentes/mayor.component';

const routes: Routes = [
  { path: '', component: MayorComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MayorRoutingModule {}
