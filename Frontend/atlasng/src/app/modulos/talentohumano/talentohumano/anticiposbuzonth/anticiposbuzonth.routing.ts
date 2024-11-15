import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnticiposbuzonthComponent } from './componentes/anticiposbuzonth.component';



const routes: Routes = [
  { path: '', component: AnticiposbuzonthComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnticiposbuzonthRoutingModule {}
