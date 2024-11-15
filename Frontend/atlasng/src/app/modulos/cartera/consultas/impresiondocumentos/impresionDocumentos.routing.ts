import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ImpresionDocumentosComponent } from './componentes/impresionDocumentos.component';

const routes: Routes = [
  { path: '', component: ImpresionDocumentosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImpresionDocumentosRoutingModule {}
