import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LovOperacionCarteraComponent } from './componentes/lov.operacionCartera.component';

const routes: Routes = [
  {
    path: '', component: LovOperacionCarteraComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovOperacionCarteraRoutingModule {}
