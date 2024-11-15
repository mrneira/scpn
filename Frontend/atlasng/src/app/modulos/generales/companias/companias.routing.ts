import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompaniasComponent } from './componentes/companias.component';

const routes: Routes = [
  { path: '', component: CompaniasComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompaniasRoutingModule {}
