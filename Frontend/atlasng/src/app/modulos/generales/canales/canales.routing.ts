import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CanalesComponent } from './componentes/canales.component';

const routes: Routes = [
  { path: '', component: CanalesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CanalesRoutingModule {}
