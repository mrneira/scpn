import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PoblarCedulaComponent } from './componentes/poblarcedula.component';

const routes: Routes = [
  { path: '', component: PoblarCedulaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PoblarCedulaRoutingModule {}
