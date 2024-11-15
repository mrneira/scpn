import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HerederosComponent } from './componentes/herederos.component';

const routes: Routes = [
  { path: '', component: HerederosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HerederosRoutingModule {}
