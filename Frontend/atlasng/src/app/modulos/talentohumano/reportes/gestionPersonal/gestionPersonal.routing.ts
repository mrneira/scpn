import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GestionPersonalComponent } from './componentes/gestionPersonal.component';

const routes: Routes = [
  { path: '', component: GestionPersonalComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionPersonalRoutingModule {}
