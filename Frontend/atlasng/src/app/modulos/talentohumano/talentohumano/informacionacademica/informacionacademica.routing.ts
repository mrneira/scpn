import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InformacionAcademicaComponent } from './componentes/informacionacademica.component';

const routes: Routes = [
  { path: '', component: InformacionAcademicaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InformacionAcademicaRoutingModule {}
