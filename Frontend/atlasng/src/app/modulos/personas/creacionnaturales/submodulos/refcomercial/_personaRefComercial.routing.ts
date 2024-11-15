import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PersonaRefComercialComponent } from './componentes/_personaRefComercial.component';

const routes: Routes = [
  { path: '', component: PersonaRefComercialComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonaRefComercialRoutingModule {}
