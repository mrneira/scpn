import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Rendvarcaso01Component } from './componentes/rendvarcaso01.component';

const routes: Routes = [
  { path: '', component: Rendvarcaso01Component,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Rendvarcaso01RoutingModule {}
