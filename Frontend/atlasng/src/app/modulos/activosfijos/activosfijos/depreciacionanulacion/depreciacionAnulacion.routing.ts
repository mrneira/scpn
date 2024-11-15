import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DepreciacionAnulacionComponent } from './componentes/depreciacionAnulacion.component';

const routes: Routes = [
  { path: '', component: DepreciacionAnulacionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepreciacionAnulacionRoutingModule {}
