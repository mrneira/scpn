import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AutorizacionviaticosComponent } from './componentes/autorizacionviaticos.component';

const routes: Routes = [
  { path: '', component: AutorizacionviaticosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AutorizacionviaticosRoutingModule {}
