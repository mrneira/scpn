import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompuniversalesComponent } from './componentes/compuniversales.component';

const routes: Routes = [
  { path: '', component: CompuniversalesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompuniversalesRoutingModule {}
