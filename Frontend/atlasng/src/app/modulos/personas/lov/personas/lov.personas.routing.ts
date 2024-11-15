import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovPersonasComponent } from './componentes/lov.personas.component';

const routes: Routes = [
  {
    path: '', component: LovPersonasComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovPersonasRoutingModule {}
