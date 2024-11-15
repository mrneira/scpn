import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { OperacionesrentafijaRoutingModule } from './operacionesrentafija.routing';
import { OperacionesrentafijaComponent } from './componentes/operacionesrentafija.component';
import { LovComentariosModule } from '../../../inversiones/lov/comentarios/lov.comentarios.module';

@NgModule({
  imports: [
    SharedModule, 
    OperacionesrentafijaRoutingModule,
    LovComentariosModule
   ],
  declarations: [OperacionesrentafijaComponent],
  exports: [OperacionesrentafijaComponent]
})
export class OperacionesrentafijaModule { }
