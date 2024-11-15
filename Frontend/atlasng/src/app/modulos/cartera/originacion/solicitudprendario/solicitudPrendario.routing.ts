import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SolicitudPrendarioComponent } from './componentes/solicitudPrendario.component';

const routes: Routes = [
  {
    path: '', component: SolicitudPrendarioComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SolicitudPrendarioRoutingModule { }
