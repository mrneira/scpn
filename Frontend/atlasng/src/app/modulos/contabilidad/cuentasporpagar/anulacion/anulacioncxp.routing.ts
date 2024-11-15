import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AnulacioncxpComponent } from './componentes/anulacioncxp.component';

const routes: Routes = [
  { path: '', component: AnulacioncxpComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnulacioncxpRoutingModule {}
