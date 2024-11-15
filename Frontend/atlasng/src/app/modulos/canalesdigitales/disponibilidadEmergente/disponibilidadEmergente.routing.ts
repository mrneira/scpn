import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DisponibilidadEmergenteComponent } from './componentes/disponibilidadEmergente.component';


const routes: Routes = [
  {
    path: '', component: DisponibilidadEmergenteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DisponibilidadEmergenteRoutingModule { }