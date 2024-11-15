import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IdiomasComponent } from './componentes/_idiomas.component';

const routes: Routes = [
  { path: '', component: IdiomasComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IdiomasRoutingModule {}
