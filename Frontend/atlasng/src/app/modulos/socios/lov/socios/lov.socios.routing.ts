import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovSociosComponent } from './componentes/lov.socios.component';

const routes: Routes = [
  {
    path: '', component: LovSociosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovSociosRoutingModule {}
