import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MantenimientoCashComponent } from './componentes/mantenimientocash.component';

const routes: Routes = [
  { path: '', component: MantenimientoCashComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MantenimientoCashRoutingModule {}
