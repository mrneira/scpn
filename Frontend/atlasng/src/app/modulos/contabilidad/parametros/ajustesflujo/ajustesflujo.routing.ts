import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AjustesFlujoComponent } from './componentes/ajustesflujo.component';

const routes: Routes = [
  { path: '', component: AjustesFlujoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AjustesFlujoRoutingModule {}
