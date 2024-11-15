import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CatalogoEstadoCashComponent } from './componentes/catalogoestadocash.component';

const routes: Routes = [
  { path: '', component: CatalogoEstadoCashComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogoEstadoCashRoutingModule {}
