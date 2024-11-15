import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelComponent } from './componentes/nivel.component';

const routes: Routes = [
  { path: '', component: NivelComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModulosRoutingModule {}
