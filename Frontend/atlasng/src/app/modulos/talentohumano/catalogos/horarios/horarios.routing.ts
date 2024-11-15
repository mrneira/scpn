import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HorariosComponent } from './componentes/horarios.component';

const routes: Routes = [
  { path: '', component: HorariosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HorariosRoutingModule {}
