import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CondicionesDescuentosComponent } from './componentes/condiciones.component';

const routes: Routes = [
  {
    path: '', component: CondicionesDescuentosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CondicionesDescuentosRoutingModule { }
