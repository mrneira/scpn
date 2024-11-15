import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DocumentosBIComponent } from './componentes/documentosBI.component';

const routes: Routes = [
  { path: '', component: DocumentosBIComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentosBIRoutingModule {}
