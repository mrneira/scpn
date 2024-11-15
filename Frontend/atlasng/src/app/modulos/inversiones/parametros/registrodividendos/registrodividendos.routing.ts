import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistrodividendosComponent } from './componentes/registrodividendos.component';

const routes: Routes = [
  { path: '', component: RegistrodividendosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistrodividendosRoutingModule {}
