import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DevolucionSuministrosComponent } from './componentes/devolucionsuministros.component';

const routes: Routes = [
  { path: '', component: DevolucionSuministrosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DevolucionSuministrosRoutingModule {}
