import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FamiliaresComponent } from './componentes/_familiares.component';

const routes: Routes = [
  { path: '', component: FamiliaresComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FamiliaresRoutingModule {}
