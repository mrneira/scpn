import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrestamosComponent } from './componentes/prestamos.component';

const routes: Routes = [
  { path: '', component: PrestamosComponent,
  }
];
 
@NgModule({ 
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrestamosRoutingModule {}
