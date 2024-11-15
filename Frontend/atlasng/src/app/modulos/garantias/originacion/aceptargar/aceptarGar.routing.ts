import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AceptarGarComponent } from './componentes/aceptarGar.component';

const routes: Routes = [
  { path: '', component: AceptarGarComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AceptarGarRoutingModule {}
