import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActaEntregaRecepcionComponent } from './componentes/actaEntregaRecepcion.component';


const routes: Routes = [
  { path: '', component: ActaEntregaRecepcionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActaEntregaRecepcionRoutingModule {}
