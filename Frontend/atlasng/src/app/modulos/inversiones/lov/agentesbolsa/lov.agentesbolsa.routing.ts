import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovAgentesbolsaComponent } from './componentes/lov.agentesbolsa.component';

const routes: Routes = [
  {
    path: '', component: LovAgentesbolsaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovAgentesbolsaRoutingModule {}