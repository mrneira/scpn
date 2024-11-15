import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovParroquiasComponent } from './componentes/lov.parroquias.component';

const routes: Routes = [
  {
    path: '', component: LovParroquiasComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovParroquiasRoutingModule {}
