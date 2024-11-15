import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MayorizarComponent } from './componentes/mayorizar.component';

const routes: Routes = [
  { path: '', component: MayorizarComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MayorizarRoutingModule { }
