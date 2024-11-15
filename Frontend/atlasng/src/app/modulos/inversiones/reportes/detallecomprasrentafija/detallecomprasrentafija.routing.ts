import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetallecomprasrentafijaComponent } from './componentes/detallecomprasrentafija.component';

const routes: Routes = [
  { path: '', component: DetallecomprasrentafijaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetallecomprasrentafijaRoutingModule {}
