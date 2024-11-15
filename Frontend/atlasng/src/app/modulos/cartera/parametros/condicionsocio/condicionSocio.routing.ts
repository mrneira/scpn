import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CondicionSocioComponent } from './componentes/condicionSocio.component';

const routes: Routes = [
  {
    path: '', component: CondicionSocioComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CondicionSocioRoutingModule { }
