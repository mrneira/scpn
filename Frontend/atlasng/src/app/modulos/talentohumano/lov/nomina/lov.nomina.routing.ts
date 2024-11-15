import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovNominaComponent } from './componentes/lov.nomina.component';

const routes: Routes = [
  {
    path: '', component: LovNominaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovNominaRoutingModule {}
