import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CatalogoEstadoBceComponent } from './componentes/catalogoestadobce.component';

const routes: Routes = [
  { path: '', component: CatalogoEstadoBceComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogoEstadoBceRoutingModule {}
