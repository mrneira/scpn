import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ComptecnicasComponent } from './componentes/comptecnicas.component';

const routes: Routes = [
  { path: '', component: ComptecnicasComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComptecnicasRoutingModule {}
