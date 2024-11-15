import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MonedasComponent } from './componentes/monedas.component';

const routes: Routes = [
  { path: '', component: MonedasComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MonedasRoutingModule {}
