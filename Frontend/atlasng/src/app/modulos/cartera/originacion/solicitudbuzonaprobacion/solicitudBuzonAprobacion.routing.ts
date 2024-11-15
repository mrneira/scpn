import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SolicitudBuzonAprobacionComponent } from './componentes/solicitudBuzonAprobacion.component';

const routes: Routes = [
  {
    path: '', component: SolicitudBuzonAprobacionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SolicitudBuzonAprobacionRoutingModule { }
