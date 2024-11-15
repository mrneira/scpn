import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreacionRapidaNaturalesComponent } from './componentes/creacionRapidaNaturales.component';

const routes: Routes = [
  { path: '', component: CreacionRapidaNaturalesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreacionRapidaNaturalesRoutingModule {}
