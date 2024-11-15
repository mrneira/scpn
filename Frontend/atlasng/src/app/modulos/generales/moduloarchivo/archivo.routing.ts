import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ArchivoComponent } from './componentes/archivo.component';

const routes: Routes = [
  { path: '', component: ArchivoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArchivoRoutingModule {}
