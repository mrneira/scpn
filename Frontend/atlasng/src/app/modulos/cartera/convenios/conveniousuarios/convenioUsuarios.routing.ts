import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConvenioUsuariosComponent } from './componentes/convenioUsuarios.component';

const routes: Routes = [
  { path: '', component: ConvenioUsuariosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConvenioUsuariosRoutingModule {}
