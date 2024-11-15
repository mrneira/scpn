import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModificacionGarComponent } from './componentes/modificacionGar.component';

const routes: Routes = [
  { path: '', component: ModificacionGarComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModificacionGarRoutingModule {}
