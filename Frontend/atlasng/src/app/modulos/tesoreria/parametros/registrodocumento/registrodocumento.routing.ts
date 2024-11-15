import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistroDocumentoComponent } from './componentes/registrodocumento.component';

const routes: Routes = [
  { path: '', component: RegistroDocumentoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistroDocumentoRoutingModule {}
