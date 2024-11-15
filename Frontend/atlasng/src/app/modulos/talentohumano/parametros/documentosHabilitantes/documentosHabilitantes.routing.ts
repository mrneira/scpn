import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DocumentosHabilitantesComponent } from './componentes/documentosHabilitantes.component';

const routes: Routes = [
  { path: '', component: DocumentosHabilitantesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentosHabilitantesRoutingModule {}
