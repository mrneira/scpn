import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoteResultadoPrevioComponent } from './componentes/_loteResultadoPrevio.component';

const routes: Routes = [
  { path: '', component: LoteResultadoPrevioComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoteResultadoPrevioRoutingModule {}
