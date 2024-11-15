import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TareasModuloLoteComponent } from './componentes/_tareasModuloLote.component';

const routes: Routes = [
  { path: '', component: TareasModuloLoteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TareasModuloLoteRoutingModule {}
