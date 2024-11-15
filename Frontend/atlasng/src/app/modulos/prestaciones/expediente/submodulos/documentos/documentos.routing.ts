import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DocumentosComponent } from './componentes/documentos.component';

const routes: Routes = [
  { path: '', component: DocumentosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocuentosRoutingModule {}
