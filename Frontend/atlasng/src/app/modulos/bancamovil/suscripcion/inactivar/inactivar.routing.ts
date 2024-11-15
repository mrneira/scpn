import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InactivarComponent } from './componentes/inactivar.component';

const routes: Routes = [
  { path: '', component: InactivarComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InactivarRoutingModule {}
