import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgenteBolsaComponent } from './componentes/agentebolsa.component';

const routes: Routes = [
  { path: '', component: AgenteBolsaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgenteBolsaRoutingModule {}
