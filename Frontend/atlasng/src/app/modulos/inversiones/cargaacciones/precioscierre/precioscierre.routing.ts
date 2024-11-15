import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrecioscierreComponent } from './componentes/precioscierre.component';

const routes: Routes = [
  { path: '', component: PrecioscierreComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrecioscierreRoutingModule {}
