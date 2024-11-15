import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListadoExpedientesAsignadosComponent } from './componentes/listadoExpedientesAsignados.component';

const routes: Routes = [
  {
    path: '', component: ListadoExpedientesAsignadosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListadoExpedientesAsignadosRoutingModule { }