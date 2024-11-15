import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ImpuestorentaComponent } from './componentes/impuestorenta.component';

const routes: Routes = [
  { path: '', component: ImpuestorentaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImpuestorentaRoutingModule {}
