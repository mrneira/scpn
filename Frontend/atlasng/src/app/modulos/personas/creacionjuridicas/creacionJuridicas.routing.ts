import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreacionJuridicasComponent } from './componentes/creacionJuridicas.component';

const routes: Routes = [
  { path: '', component: CreacionJuridicasComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreacionJuridicasRoutingModule {}
