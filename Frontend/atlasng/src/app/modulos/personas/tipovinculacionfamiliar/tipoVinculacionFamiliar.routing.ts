import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TipoVinculacionFamiliarComponent } from './componentes/tipoVinculacionFamiliar.component';

const routes: Routes = [
  { path: '', component: TipoVinculacionFamiliarComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TipoVinculacionFamiliarRoutingModule {}
