import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResumenBonosComponent } from './componentes/resumenBonos.component';

const routes: Routes = [
  { path: '', component: ResumenBonosComponent,
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ResumenBonosRoutingModule {}
