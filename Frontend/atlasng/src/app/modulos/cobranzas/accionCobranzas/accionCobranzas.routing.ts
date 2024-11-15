import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccionCobranzasComponent } from './componentes/accionCobranzas.component';

const routes: Routes = [
  { path: '', component: AccionCobranzasComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccionCobranzasRoutingModule {}
