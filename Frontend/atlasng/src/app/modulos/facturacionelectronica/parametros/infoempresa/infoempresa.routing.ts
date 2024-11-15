import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InfoEmpresaComponent } from './componentes/infoempresa.component';

const routes: Routes = [
  { path: '', component: InfoEmpresaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InfoEmpresaRoutingModule {}
