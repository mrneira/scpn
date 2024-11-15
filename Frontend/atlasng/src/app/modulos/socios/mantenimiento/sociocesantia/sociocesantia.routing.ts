import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SocioCesantiaComponent } from './componentes/sociocesantia.component';

const routes: Routes = [
  { path: '', component: SocioCesantiaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SocioCesantiaRoutingModule {}
