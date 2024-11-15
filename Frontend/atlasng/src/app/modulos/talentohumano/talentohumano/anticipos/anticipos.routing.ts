import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnticiposComponent } from './componentes/anticipos.component';


const routes: Routes = [
  { path: '', component: AnticiposComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnticiposRoutingModule {}
