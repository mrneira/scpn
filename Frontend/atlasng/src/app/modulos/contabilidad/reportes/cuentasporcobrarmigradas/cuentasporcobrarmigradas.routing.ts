import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CuentasporcobrarMigradasComponent } from './componentes/cuentasporcobrarmigradas.component';

const routes: Routes = [
  { path: '', component: CuentasporcobrarMigradasComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CuentasporcobrarMigradasRoutingModule {}
