import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TipoBienComponent } from './componentes/tipoBien.component';

const routes: Routes = [
  { path: '', component: TipoBienComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TipoBienRoutingModule {}
