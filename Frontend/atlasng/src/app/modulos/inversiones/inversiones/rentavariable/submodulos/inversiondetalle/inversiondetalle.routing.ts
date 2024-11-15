import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InversiondetalleComponent } from './componentes/inversiondetalle.component';

const routes: Routes = [
  { path: '', component: InversiondetalleComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InversiondetalleRoutingModule {}
