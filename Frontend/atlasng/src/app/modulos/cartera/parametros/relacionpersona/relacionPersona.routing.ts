import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RelacionPersonaComponent } from './componentes/relacionPersona.component';

const routes: Routes = [
  { path: '', component: RelacionPersonaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RelacionPersonaRoutingModule {}
