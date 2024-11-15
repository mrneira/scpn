import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustodioActivosFuncionariosComponent } from './componentes/custodioactivosfuncionarios.component';

const routes: Routes = [
  { path: '', component: CustodioActivosFuncionariosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustodioActivosFuncionariosRoutingModule {}
