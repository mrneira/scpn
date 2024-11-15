import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OperativocontablervComponent } from './componentes/operativocontablerv.component';

const routes: Routes = [
  {
    path:'',component: OperativocontablervComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperativocontablervRoutingModule { }
 