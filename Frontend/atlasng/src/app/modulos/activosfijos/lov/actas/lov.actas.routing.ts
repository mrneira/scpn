import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovActasComponent } from './componentes/lov.actas.component';

const routes: Routes = [
  {
    path: '', component: LovActasComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovActasRoutingModule {}
