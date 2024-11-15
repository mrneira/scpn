import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovModuloComponent } from './componentes/lovModulo.component';

const routes: Routes = [
  { path: '', component: LovModuloComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovModuloRoutingModule {}
