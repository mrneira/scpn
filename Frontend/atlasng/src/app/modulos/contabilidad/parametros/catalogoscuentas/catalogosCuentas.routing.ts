import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CatalogosCuentasComponent } from './componentes/catalogosCuentas.component';

const routes: Routes = [
  { path: '', component: CatalogosCuentasComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModulosRoutingModule {}
