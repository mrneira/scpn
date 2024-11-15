import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SimulacionDescuentosComponent } from './componentes/simulacionDescuentos.component';

const routes: Routes = [
  {
    path: '', component: SimulacionDescuentosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SimulacionDescuentosRoutingModule { }
