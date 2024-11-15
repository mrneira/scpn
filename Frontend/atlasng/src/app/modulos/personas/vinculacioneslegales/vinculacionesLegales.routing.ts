import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VinculacionesLegalesComponent } from './componentes/vinculacionesLegales.component';

const routes: Routes = [
  { path: '', component: VinculacionesLegalesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VinculacionesLegalesRoutingModule {}
