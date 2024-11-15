import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NjsDetalleComponent } from './componentes/njs.component';

const routes: Routes = [
  { path: '', component: NjsDetalleComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NjsDetalleRoutingModule {}
