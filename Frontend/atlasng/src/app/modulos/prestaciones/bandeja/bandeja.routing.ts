import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BandejaComponent } from './componentes/bandeja.component';

const routes: Routes = [
  { path: '', component: BandejaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BandejaRoutingModule {}
