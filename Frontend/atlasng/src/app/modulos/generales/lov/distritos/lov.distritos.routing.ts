import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovDistritosComponent } from './componentes/lov.distritos.component';

const routes: Routes = [
  {
    path: '', component: LovDistritosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovDistritosRoutingModule {}
