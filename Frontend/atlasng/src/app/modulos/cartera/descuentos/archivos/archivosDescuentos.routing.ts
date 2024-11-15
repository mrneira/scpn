import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ArchivosDescuentosComponent } from './componentes/archivosDescuentos.component';

const routes: Routes = [
  {
    path: '', component: ArchivosDescuentosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArchivosDescuentosRoutingModule { }
