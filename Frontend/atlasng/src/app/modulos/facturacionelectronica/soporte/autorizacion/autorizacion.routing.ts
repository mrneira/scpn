import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AutorizacionComponent } from './componentes/autorizacion.component';

const routes: Routes = [
  { path: '', component: AutorizacionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AutorizacionRoutingModule {}
