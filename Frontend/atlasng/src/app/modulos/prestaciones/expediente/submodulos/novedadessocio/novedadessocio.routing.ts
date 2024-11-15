import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NovedadessocioComponent } from './componentes/novedadessocio.component';

const routes: Routes = [
  { path: '', component: NovedadessocioComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NovedadessocioRoutingModule {}
