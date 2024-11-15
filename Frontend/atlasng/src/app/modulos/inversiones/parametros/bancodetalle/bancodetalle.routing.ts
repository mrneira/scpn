import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BancodetalleComponent } from './componentes/bancodetalle.component';

const routes: Routes = [
  { path: '', component: BancodetalleComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BancodetalleRoutingModule {}
