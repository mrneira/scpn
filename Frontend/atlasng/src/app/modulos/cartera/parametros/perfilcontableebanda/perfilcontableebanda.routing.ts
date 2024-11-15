import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PerfilContableEbandaComponent } from '././componentes/perfilcontableebanda.component';

const routes: Routes = [
  { path: '', component: PerfilContableEbandaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PerfilContableEbandaRoutingModule {}
