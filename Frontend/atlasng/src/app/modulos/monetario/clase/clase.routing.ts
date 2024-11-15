import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClaseComponent } from './componentes/clase.component';

const routes: Routes = [
  { path: '', component: ClaseComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModulosRoutingModule {}
