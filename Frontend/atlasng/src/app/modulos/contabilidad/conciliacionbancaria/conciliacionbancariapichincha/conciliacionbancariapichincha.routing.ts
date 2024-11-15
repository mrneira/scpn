import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConciliacionBancariaPichinchaComponent } from './componentes/conciliacionbancariapichincha.component';

const routes: Routes = [
  { path: '', component: ConciliacionBancariaPichinchaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConciliacionBancariaPichinchaRoutingModule {}
