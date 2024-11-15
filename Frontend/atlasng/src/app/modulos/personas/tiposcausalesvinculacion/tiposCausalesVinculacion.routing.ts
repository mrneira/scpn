import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TiposCausalesVinculacionComponent } from './componentes/tiposCausalesVinculacion.component';

const routes: Routes = [
  { path: '', component: TiposCausalesVinculacionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TiposCausalesVinculacionRoutingModule {}
