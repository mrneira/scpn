import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlananualComponent } from './componentes/plananual.component';

const routes: Routes = [
  { path: '', component: PlananualComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlananualRoutingModule {}
