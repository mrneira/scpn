import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovComentariosRoutingModule } from './lov.comentarios.routing';

import { LovComentariosComponent } from './componentes/lov.comentarios.component';

@NgModule({
  imports: [SharedModule, LovComentariosRoutingModule],
  declarations: [LovComentariosComponent],
  exports: [LovComentariosComponent],
})
export class LovComentariosModule { }