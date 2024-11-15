import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreacionNaturalesComponent } from './componentes/creacionNaturales.component';

const routes: Routes = [
  { path: '', component: CreacionNaturalesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreacionNaturalesRoutingModule {}
