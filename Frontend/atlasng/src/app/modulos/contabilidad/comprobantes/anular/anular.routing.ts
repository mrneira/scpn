import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AnularComponent } from './componentes/anular.component';

const routes: Routes = [
  { path: '', component: AnularComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnularRoutingModule {}
