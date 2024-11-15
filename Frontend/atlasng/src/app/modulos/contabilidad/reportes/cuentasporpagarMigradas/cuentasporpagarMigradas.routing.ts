import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CuentasporpagarMigradasComponent } from './componentes/cuentasporpagarMigradas.component';

const routes: Routes = [
  { path: '', component: CuentasporpagarMigradasComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CuentasporpagarMigradasRoutingModule {}
