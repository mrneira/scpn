import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GenerarArchivoCobroComponent } from './componentes/generararchivocobro.component';

const routes: Routes = [
  { path: '', component: GenerarArchivoCobroComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GenerarArchivoCobroRoutingModule {}
