import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FotoFirmaComponent } from './componentes/fotoFirma.component';

const routes: Routes = [
  { path: '', component: FotoFirmaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FotoFirmaRoutingModule {}
