import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InversionesPorTipoComponent } from './componentes/inversionesportipo.component';

const routes: Routes = [
  { path: '', component: InversionesPorTipoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InversionesPorTipoRoutingModule {}
