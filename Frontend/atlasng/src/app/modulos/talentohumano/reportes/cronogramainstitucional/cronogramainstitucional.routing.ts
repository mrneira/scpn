import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CronogramaComponent } from './componentes/cronogramainstitucional.component';

const routes: Routes = [
  { path: '', component: CronogramaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CronogramaRoutingModule {}
