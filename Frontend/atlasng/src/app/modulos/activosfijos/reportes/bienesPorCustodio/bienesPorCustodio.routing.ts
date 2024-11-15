import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BienesPorCustodioComponent } from './componentes/bienesPorCustodio.component';

const routes: Routes = [
  { path: '', component: BienesPorCustodioComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BienesPorCustodioRoutingModule {}
