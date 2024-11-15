import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CondonarComponent } from './componentes/condonar.component';

const routes: Routes = [
  {
    path: '', component: CondonarComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CondonarRoutingModule { }
