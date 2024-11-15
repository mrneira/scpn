import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovEgresosComponent } from './componentes/lov.egresos.component';

const routes: Routes = [
  {
    path: '', component: LovEgresosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovEgresosRoutingModule {}
