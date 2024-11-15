import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TraspasoLegalCobranzaComponent } from './componentes/traspasoLegalCobranza.component';

const routes: Routes = [
  { path: '', component: TraspasoLegalCobranzaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TraspasoLegalCobranzaRoutingModule {}
