import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecaudacionCobranzasComponent } from './componentes/recaudacionCobranzas.component';

const routes: Routes = [
  {
    path: '', component: RecaudacionCobranzasComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecaudacionCobranzasRoutingModule { }