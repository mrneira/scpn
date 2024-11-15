import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustodioActivosFuncionarioComponent } from './componentes/custodioactivosfuncionario.component';

const routes: Routes = [
  { path: '', component: CustodioActivosFuncionarioComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustodioActivosFuncionarioRoutingModule {}
