import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InstitucionEducativaComponent } from './componentes/institucioneducativa.component';

const routes: Routes = [
  { path: '', component: InstitucionEducativaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstitucionEducativaRoutingModule {}
