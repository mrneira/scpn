import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovCausalesVinculacionComponent } from './componentes/lov.causalesVinculacion.component';

const routes: Routes = [
  {
    path: '', component: LovCausalesVinculacionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovCausalesVinculacionRoutingModule {}
