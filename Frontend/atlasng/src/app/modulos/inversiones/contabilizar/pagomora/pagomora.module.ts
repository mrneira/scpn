import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { PagomoraRoutingModule } from './pagomora.routing';
import { PagomoraComponent } from './componentes/pagomora.component';
import { LovComentariosModule } from '../../../inversiones/lov/comentarios/lov.comentarios.module';

@NgModule({
  imports: [
    SharedModule, 
    PagomoraRoutingModule,
    LovComentariosModule
   ],
  declarations: [PagomoraComponent],
  exports: [PagomoraComponent]
})
export class PagomoraModule { }
