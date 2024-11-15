import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DesignacionesComponent } from './componentes/designaciones.component';

const routes: Routes = [
  { path: '', component: DesignacionesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DesignacionesRoutingModule {}
