import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovKardexCodificadoRoutingModule } from './lov.kardexcodificado.routing';

import { LovKardexCodificadoComponent } from './componentes/lov.kardexcodificado.component';


@NgModule({
  imports: [SharedModule, LovKardexCodificadoRoutingModule],
  declarations: [LovKardexCodificadoComponent],
  exports: [LovKardexCodificadoComponent]
})
export class LovKardexCodificadoModule { }

