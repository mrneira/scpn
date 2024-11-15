import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AnexoTransaccionalComponent } from './componentes/anexotransaccional.component';

const routes: Routes = [
  { path: '', component: AnexoTransaccionalComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnexoTransaccionalRoutingModule {}
