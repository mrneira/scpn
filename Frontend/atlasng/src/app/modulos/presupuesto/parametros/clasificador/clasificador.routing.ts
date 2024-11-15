import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClasificadorComponent } from './componentes/clasificador.component';

const routes: Routes = [
  { path: '', component: ClasificadorComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClasificadorRoutingModule {}
