import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClienteDireccionComponent } from './componentes/_clienteDireccion.component';

const routes: Routes = [
  { path: '', component: ClienteDireccionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClienteDireccionRoutingModule {}
