import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GenerarPagoInvComponent } from './componentes/generarpagoinv.component';

const routes: Routes = [
  { path: '', component: GenerarPagoInvComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GenerarPagoInvRoutingModule {}
