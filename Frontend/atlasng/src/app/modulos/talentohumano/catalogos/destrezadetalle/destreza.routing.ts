import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DestrezaComponent } from './componentes/destreza.component';

const routes: Routes = [
  { path: '', component: DestrezaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DestrezaRoutingModule {}
