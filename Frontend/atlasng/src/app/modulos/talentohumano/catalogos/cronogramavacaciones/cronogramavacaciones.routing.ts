import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CronogramavacacionesComponent } from './componentes/cronogramavacaciones.component';

const routes: Routes = [
  { path: '', component: CronogramavacacionesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CronogramavacacionesRoutingModule {}
