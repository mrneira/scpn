import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PersonaDireccionComponent } from './componentes/_personaDireccion.component';

const routes: Routes = [
  { path: '', component: PersonaDireccionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonaDireccionRoutingModule {}
