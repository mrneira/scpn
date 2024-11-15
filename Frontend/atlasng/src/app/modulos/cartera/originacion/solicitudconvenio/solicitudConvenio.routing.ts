import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SolicitudConvenioComponent } from './componentes/solicitudConvenio.component';

const routes: Routes = [
  {
    path: '', component: SolicitudConvenioComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SolicitudConvenioRoutingModule { }
