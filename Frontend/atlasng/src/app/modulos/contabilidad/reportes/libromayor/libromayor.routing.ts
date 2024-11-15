import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LibromayorComponent } from './componentes/libromayor.component';

const routes: Routes = [
  { path: '', component: LibromayorComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LibromayorRoutingModule {}
