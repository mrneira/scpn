import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InstrumentoComponent } from './componentes/instrumento.component';

const routes: Routes = [
  { path: '', component: InstrumentoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstrumentoRoutingModule {}
