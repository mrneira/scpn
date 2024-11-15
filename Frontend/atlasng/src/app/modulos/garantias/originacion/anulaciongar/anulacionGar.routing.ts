import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AnulacionGarComponent } from './componentes/anulacionGar.component';

const routes: Routes = [
  {
    path: '', component: AnulacionGarComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnulacionGarRoutingModule { }
