import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LibromayorNCuentasComponent } from './componentes/libromayorNCuentas.component';

const routes: Routes = [
  { path: '', component: LibromayorNCuentasComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LibromayorNCuentasRoutingModule {}
