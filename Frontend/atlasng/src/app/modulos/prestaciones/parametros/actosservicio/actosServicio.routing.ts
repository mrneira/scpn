import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActosServicioComponent } from './componentes/actosServicio.component';

const routes: Routes = [
  { path: '', component: ActosServicioComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActosServicioRoutingModule {}
