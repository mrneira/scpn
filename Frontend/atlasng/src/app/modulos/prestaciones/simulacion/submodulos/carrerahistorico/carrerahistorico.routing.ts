import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CarrerahistoricoComponent } from './componentes/carrerahistorico.component';

const routes: Routes = [
  { path: '', component: CarrerahistoricoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarrerahistoricoRoutingModule {}
