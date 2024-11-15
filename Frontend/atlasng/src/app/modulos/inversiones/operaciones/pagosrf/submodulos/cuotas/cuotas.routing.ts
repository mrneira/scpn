import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CuotasComponent } from './componentes/cuotas.component';

const routes: Routes = [
  { path: '', component: CuotasComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CuotasRoutingModule {}
