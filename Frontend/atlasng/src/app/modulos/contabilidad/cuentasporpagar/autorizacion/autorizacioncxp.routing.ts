import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AutorizacioncxpComponent } from './componentes/autorizacioncxp.component';

const routes: Routes = [
  { path: '', component: AutorizacioncxpComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AutorizacioncxpRoutingModule {}
