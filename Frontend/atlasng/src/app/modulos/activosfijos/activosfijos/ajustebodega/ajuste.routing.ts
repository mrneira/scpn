import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AjusteComponent } from './componentes/ajuste.component';

const routes: Routes = [
  { path: '', component: AjusteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AjusteRoutingModule {}
