import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SolicitudBuzonComponent } from './componentes/solicitudBuzon.component';

const routes: Routes = [
  {
    path: '', component: SolicitudBuzonComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SolicitudBuzonRoutingModule { }
