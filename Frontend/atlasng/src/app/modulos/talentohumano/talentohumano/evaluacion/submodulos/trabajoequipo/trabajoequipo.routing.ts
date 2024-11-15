import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {TrabajoequipoComponent  } from './componentes/trabajoequipo.component';

const routes: Routes = [
  { path: '', component: TrabajoequipoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrabajoequipoRoutingModule {}
