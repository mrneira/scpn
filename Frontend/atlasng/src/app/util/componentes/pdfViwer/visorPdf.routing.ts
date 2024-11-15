import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VisorPdfComponent } from './componentes/visorPdf.component';

const routes: Routes = [
  {
    path: '', component: VisorPdfComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VisorPdfRoutingModule {}
