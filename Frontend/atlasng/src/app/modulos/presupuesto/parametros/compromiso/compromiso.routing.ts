import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompromisoComponent } from './componentes/compromiso.component';

const routes: Routes = [
  { path: '', component: CompromisoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompromisoRoutingModule {}
