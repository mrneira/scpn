import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovPersonaVistaComponent } from './componentes/lov.personaVista.component';

const routes: Routes = [
  {
    path: '', component: LovPersonaVistaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovPersonaVistaRoutingModule { }
