import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LibrobancosComponent } from './componentes/librobancos.component';

const routes: Routes = [
  { path: '', component: LibrobancosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LibrobancosRoutingModule {}
