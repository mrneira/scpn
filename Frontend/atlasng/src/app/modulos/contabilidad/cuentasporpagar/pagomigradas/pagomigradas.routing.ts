import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagoMigradasComponent } from './componentes/pagomigradas.component';

const routes: Routes = [
  { path: '', component: PagoMigradasComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagoMigradasRoutingModule {}
