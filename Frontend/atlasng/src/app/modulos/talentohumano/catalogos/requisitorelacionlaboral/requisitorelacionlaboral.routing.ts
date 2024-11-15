import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RequisitoRelacionLaboralComponent } from './componentes/requisitorelacionlaboral.component';

const routes: Routes = [
  { path: '', component: RequisitoRelacionLaboralComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequisitoContratoRoutingModule {}
