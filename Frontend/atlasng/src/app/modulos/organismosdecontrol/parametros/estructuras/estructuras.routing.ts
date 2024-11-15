import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EstructurasComponent } from './componentes/estructuras.component';

const routes: Routes = [
  { path: '', component: EstructurasComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstructurasRoutingModule {}
