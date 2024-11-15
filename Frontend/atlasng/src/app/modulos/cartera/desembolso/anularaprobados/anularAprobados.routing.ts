import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnularAprobadosComponent } from './componentes/anularAprobados.component';


const routes: Routes = [
  { path: '', component: AnularAprobadosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnularCarteraRoutingModule {}
