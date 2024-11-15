import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DividendosComponent } from './componentes/dividendos.component';

const routes: Routes = [
  { path: '', component: DividendosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DividendosRoutingModule {}
