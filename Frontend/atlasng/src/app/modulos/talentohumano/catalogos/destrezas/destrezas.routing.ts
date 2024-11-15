import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DestrezasComponent } from './componentes/destrezas.component';

const routes: Routes = [
  { path: '', component: DestrezasComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DestrezasRoutingModule {}
