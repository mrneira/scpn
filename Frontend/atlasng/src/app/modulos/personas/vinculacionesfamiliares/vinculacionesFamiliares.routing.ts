import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VinculacionesFamiliaresComponent } from './componentes/vinculacionesFamiliares.component';

const routes: Routes = [
  { path: '', component: VinculacionesFamiliaresComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VinculacionesFamiliaresRoutingModule {}
