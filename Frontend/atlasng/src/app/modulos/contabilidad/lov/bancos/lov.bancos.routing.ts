import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovBancosComponent } from './componentes/lov.bancos.component';

const routes: Routes = [
  {
    path: '', component: LovBancosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovBancosRoutingModule {}
