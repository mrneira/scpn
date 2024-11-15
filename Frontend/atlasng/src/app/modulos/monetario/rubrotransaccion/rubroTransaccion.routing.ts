import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RubroTransaccionComponent } from './componentes/rubroTransaccion.component';

const routes: Routes = [
  { path: '', component: RubroTransaccionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RubroTransaccionRoutingModule {}
