import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InicioDiaComponent } from './componentes/inicioDia.component';

const routes: Routes = [
  { path: '', component: InicioDiaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InicioDiaRoutingModule {}
