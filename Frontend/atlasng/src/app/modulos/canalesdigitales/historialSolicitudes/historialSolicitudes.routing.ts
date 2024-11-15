import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HistorialSolicitudesComponent } from './componentes/historialSolicitudes.component';


const routes: Routes = [
  {
    path: '', component: HistorialSolicitudesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HistorialSolicitudesRoutingModule { }
