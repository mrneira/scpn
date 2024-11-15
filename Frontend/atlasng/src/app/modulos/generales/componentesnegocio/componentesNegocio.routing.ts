import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ComponentesNegocioComponent } from './componentes/componentesNegocio.component';

const routes: Routes = [
  { path: '', component: ComponentesNegocioComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComponentesNegocioRoutingModule {}
