import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DescuentosComponent } from './componentes/_descuentos.component';

const routes: Routes = [
  { path: '', component: DescuentosComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DescuentosRoutingModule {}
