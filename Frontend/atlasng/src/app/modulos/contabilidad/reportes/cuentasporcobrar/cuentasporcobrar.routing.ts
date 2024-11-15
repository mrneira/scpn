import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CuentasporcobrarComponent } from './componentes/cuentasporcobrar.component';

const routes: Routes = [
  { path: '', component: CuentasporcobrarComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CuentasporcobrarRoutingModule {}
