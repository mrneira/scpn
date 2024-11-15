import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CertificadoPrimaSegurosComponent } from './componentes/certificadoPrimaSeguros.component';

const routes: Routes = [
  { path: '', component: CertificadoPrimaSegurosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CertificadoPrimaSegurosRoutingModule {}
