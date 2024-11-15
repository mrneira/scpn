import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LovSociosCertificadosComponent } from './componentes/lov.socioscertificados.component';

const routes: Routes = [
  {
    path: '', component: LovSociosCertificadosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovSociosCertificadosRoutingModule {}
