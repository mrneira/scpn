import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DestinoFondosComponent } from './componentes/destinoFondos.component';

const routes: Routes = [
  { path: '', component: DestinoFondosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DestinoFondosRoutingModule {}
