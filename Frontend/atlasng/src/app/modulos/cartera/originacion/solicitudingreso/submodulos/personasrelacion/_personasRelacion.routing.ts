import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PersonasRelacionComponent } from './componentes/_personasRelacion.component';

const routes: Routes = [
  { path: '', component: PersonasRelacionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonasRelacionRoutingModule {}
