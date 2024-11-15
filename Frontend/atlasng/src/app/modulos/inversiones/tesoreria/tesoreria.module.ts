import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { TesoreriaRoutingModule } from './tesoreria.routing';
import { TesoreriaComponent } from './componentes/tesoreria.component';
import { LovComentariosModule } from '../../inversiones/lov/comentarios/lov.comentarios.module';

@NgModule({
  imports: [
    SharedModule, 
    TesoreriaRoutingModule,
    LovComentariosModule

    
   ],
  declarations: [TesoreriaComponent],
  exports: []
 
})
export class TesoreriaModule { }
