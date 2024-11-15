import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AseguradoraComponent } from './componentes/aseguradora.component';

const routes: Routes = [
  {
    path: '', component: AseguradoraComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AseguradoraRoutingModule { }
