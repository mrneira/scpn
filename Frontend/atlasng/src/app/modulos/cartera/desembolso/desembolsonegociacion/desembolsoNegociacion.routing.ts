import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DesembolsoNegociacionComponent } from './componentes/desembolsoNegociacion.component';

const routes: Routes = [
  {
    path: '', component: DesembolsoNegociacionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DesembolsoNegociacionRoutingModule { }
