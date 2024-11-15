import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IngresocxcComponent } from './componentes/ingresocxc.component';

const routes: Routes = [
  { path: '', component: IngresocxcComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IngresocxcRoutingModule {}
