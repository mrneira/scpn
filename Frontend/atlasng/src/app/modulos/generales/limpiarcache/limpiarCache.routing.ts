import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LimpiarCacheComponent } from './componentes/limpiarCache.component';

const routes: Routes = [
  { path: '', component: LimpiarCacheComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LimpiarCacheRoutingModule {}
