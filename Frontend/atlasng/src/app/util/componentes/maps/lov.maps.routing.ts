import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovMapsComponent } from './componentes/lov.maps.component';

const routes: Routes = [
  {
    path: '', component: LovMapsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovMapsRoutingModule {}