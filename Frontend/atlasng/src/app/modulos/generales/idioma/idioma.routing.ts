import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IdiomaComponent } from './componentes/idioma.component';

const routes: Routes = [
  { path: '', component: IdiomaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IdiomaRoutingModule {}
