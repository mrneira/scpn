import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InscripcionGarComponent } from './componentes/inscripcionGar.component';

const routes: Routes = [
  { path: '', component: InscripcionGarComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InscripcionGarRoutingModule {}
