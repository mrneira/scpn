import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GastodeducibleComponent } from './componentes/gastodeducible.component';

const routes: Routes = [
  { path: '', component: GastodeducibleComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GastodeducibleRoutingModule {}
