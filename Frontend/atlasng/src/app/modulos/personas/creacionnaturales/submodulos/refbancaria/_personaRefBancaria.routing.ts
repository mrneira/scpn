import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PersonaRefBancariaComponent } from './componentes/_personaRefBancaria.component';

const routes: Routes = [
  { path: '', component: PersonaRefBancariaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonaRefBancariaRoutingModule {}
