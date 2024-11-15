import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {CabeceraComponent  } from './componentes/cabecera.component';

const routes: Routes = [
  { path: '', component: CabeceraComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CabeceraRoutingModule {}
