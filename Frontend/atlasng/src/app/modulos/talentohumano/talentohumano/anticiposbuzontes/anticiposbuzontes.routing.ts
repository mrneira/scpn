import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnticiposbuzontesComponent } from './componentes/anticiposbuzontes.component';

const routes: Routes = [
  { path: '', component: AnticiposbuzontesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnticiposbuzontesRoutingModule {}
