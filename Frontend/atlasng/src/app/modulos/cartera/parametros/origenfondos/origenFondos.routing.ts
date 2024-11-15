import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrigenFondosComponent } from './componentes/origenFondos.component';

const routes: Routes = [
  { path: '', component: OrigenFondosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrigenFondosRoutingModule {}
