import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RolprovisionComponent } from './componentes/rolprovision.component';

const routes: Routes = [
  { path: '', component: RolprovisionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolprovisionRoutingModule {}
