import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PersonaInfAdicionalComponent } from './componentes/_personaInfAdicional.component';

const routes: Routes = [
  { path: '', component: PersonaInfAdicionalComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonaInfAdicionalRoutingModule {}
