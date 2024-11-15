import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AsignarProductoFuncionariosComponent } from './componentes/asignarproductofuncionarios.component';

const routes: Routes = [
  { path: '', component: AsignarProductoFuncionariosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AsignarProductoFuncionariosRoutingModule {}
