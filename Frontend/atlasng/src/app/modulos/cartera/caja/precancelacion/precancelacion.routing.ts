import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrecancelacionComponent } from './componentes/precancelacion.component';

const routes: Routes = [
  { path: '', component: PrecancelacionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrecancelacionRoutingModule {}
