import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TipoCuentaContableFlujoComponent } from './componentes/tipocuentacontableflujo.component';

const routes: Routes = [
  { path: '', component: TipoCuentaContableFlujoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TipoCuentaContableFlujoRoutingModule {}
