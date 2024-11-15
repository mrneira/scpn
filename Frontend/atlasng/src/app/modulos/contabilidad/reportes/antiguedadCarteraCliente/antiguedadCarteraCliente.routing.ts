import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AntiguedadCarteraClienteComponent } from './componentes/antiguedadCarteraCliente.component';

const routes: Routes = [
  { path: '', component: AntiguedadCarteraClienteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AntiguedadCarteraClienteRoutingModule {}
