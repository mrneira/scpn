import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReasignacionCobranzasComponent } from './componentes/reasignacionCobranzas.component';

const routes: Routes = [
  { path: '', component: ReasignacionCobranzasComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReasignacionCobranzasRoutingModule {}
