import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReformaPresupuestariaComponent } from './componentes/reformapresupuestaria.component';

const routes: Routes = [
  { path: '', component: ReformaPresupuestariaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReformaPresupuestariaRoutingModule {}
