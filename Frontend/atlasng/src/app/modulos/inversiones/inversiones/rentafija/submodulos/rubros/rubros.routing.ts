import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RubrosComponent } from './componentes/rubros.component';

const routes: Routes = [
  { path: '', component: RubrosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RubrosRoutingModule {}
