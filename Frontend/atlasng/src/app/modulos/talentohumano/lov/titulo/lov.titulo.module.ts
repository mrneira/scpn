import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovTituloRoutingModule } from './lov.titulo.routing';
import { LovTituloComponent } from './componentes/lov.titulo.component';

@NgModule({
  imports: [SharedModule, LovTituloRoutingModule],
  declarations: [LovTituloComponent],
  exports: [LovTituloComponent]
})
export class LovTituloModule { }

