import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DesembolsoComponent } from './componentes/_desembolso.component';

const routes: Routes = [
  {
    path: '', component: DesembolsoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DesembolsoRoutingModule { }
