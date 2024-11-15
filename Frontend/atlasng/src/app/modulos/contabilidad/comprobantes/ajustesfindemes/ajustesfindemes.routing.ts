import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AjustesfindemesComponent } from './componentes/ajustesfindemes.component';

const routes: Routes = [
  { path: '', component: AjustesfindemesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AjustesfindemesRoutingModule {}
