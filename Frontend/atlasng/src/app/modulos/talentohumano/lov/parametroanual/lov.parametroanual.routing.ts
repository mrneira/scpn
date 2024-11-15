import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ParametroanualComponent} from './componentes/lov.parametroanual.component';

const routes: Routes = [
  {
    path: '', component: ParametroanualComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParametroanualRoutingModule {}
