import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlantillasNotificacionComponent } from './componentes/plantillasNotificacion.component';

const routes: Routes = [
  { path: '', component: PlantillasNotificacionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlantillasNotificacionRoutingModule {}
