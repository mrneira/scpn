import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConciliacionbancariaComponent } from './componentes/conciliacionbancaria.component';

const routes: Routes = [
  { path: '', component: ConciliacionbancariaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConciliacionbancariaRoutingModule {}
