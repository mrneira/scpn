import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TipoPoliciaComponent } from './componentes/tipopolicia.component';

const routes: Routes = [
  { path: '', component: TipoPoliciaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TipoPoliciaRoutingModule {}
