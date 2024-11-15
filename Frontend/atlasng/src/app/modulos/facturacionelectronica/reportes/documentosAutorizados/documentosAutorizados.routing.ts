import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DocumentosAutorizadosComponent } from './componentes/documentosAutorizados.component';

const routes: Routes = [
  { path: '', component: DocumentosAutorizadosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentosAutorizadosRoutingModule {}
