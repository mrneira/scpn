import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TraspasoMasivoLegalCobranzaComponent } from './componentes/traspasoMasivoLegalCobranza.component';

const routes: Routes = [
  { path: '', component: TraspasoMasivoLegalCobranzaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TraspasoMasivoLegalCobranzaRoutingModule {}
