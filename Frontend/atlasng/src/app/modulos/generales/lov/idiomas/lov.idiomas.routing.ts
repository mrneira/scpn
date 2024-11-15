import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovIdiomasComponent } from './componentes/lov.idiomas.component';

const routes: Routes = [
  {
    path: '', component: LovIdiomasComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovIdiomasRoutingModule {}
