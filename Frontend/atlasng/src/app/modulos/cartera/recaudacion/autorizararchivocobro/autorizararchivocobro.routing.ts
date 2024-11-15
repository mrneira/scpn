import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AutorizarArchivoCobroComponent } from './componentes/autorizararchivocobro.component';

const routes: Routes = [
  { path: '', component: AutorizarArchivoCobroComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AutorizarArchivoCobroRoutingModule {}
