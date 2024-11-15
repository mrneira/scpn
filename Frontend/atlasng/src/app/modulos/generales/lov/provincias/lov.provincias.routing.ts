import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovProvinciasComponent } from './componentes/lov.provincias.component';

const routes: Routes = [
  {
    path: '', component: LovProvinciasComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovProvinciasRoutingModule {}
