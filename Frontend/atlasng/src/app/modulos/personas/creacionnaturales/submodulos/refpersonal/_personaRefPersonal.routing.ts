import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PersonaRefPersonalComponent } from './componentes/_personaRefPersonal.component';

const routes: Routes = [
  { path: '', component: PersonaRefPersonalComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonaRefPersonalRoutingModule {}
