import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PortafoliorfsectorComponent } from './componentes/portafoliorfsector.component';

const routes: Routes = [
  { path: '', component: PortafoliorfsectorComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortafoliorfsectorRoutingModule {}
