import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ParroquiasComponent } from './componentes/parroquias.component';

const routes: Routes = [
  { path: '', component: ParroquiasComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParroquiasRoutingModule {}