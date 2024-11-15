import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResumenPortafolioComponent } from './componentes/resumenportafolio.component';

const routes: Routes = [
  { path: '', component: ResumenPortafolioComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResumenPortafolioRoutingModule {}
