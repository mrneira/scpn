import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ParametrizacionAnualComponent } from './componentes/anuales.component';

const routes: Routes = [
  { path: '', component: ParametrizacionAnualComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParametrizacionAnualRoutingModule {}
