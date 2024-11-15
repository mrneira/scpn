import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagoSupaComponent } from './componentes/supa.component';

const routes: Routes = [
  { path: '', component: PagoSupaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagoSupaRoutingModule {}
