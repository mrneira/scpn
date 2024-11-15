import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResumenBancosComponent } from './componentes/resumenBancos.component';

const routes: Routes = [
  { path: '', component: ResumenBancosComponent,
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ResumenBancosRoutingModule {}
