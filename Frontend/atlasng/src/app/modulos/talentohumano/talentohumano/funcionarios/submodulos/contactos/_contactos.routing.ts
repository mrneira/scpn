import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContactosComponent } from './componentes/_contactos.component';

const routes: Routes = [
  { path: '', component: ContactosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactosRoutingModule {}
