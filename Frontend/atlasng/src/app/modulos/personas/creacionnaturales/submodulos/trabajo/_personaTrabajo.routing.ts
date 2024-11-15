import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PersonaTrabajoComponent } from './componentes/_personaTrabajo.component';

const routes: Routes = [
  { path: '', component: PersonaTrabajoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonaTrabajoRoutingModule {}
