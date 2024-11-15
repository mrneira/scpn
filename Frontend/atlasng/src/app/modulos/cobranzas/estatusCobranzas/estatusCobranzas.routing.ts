import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EstatusCobranzasComponent } from './componentes/estatusCobranzas.component';

const routes: Routes = [
  { path: '', component: EstatusCobranzasComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstatusCobranzasRoutingModule {}
