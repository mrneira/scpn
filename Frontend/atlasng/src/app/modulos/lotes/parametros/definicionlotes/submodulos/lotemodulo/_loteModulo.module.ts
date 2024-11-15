import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { LoteModuloRoutingModule } from './_loteModulo.routing';

import { LoteModuloComponent } from './componentes/_loteModulo.component';
import { LovModuloModule } from '../../../../lov/lovmodulo/lovModulo.module';
import { LovPersonasModule } from '../../../../../personas/lov/personas/lov.personas.module';

@NgModule({
  imports: [SharedModule, LoteModuloRoutingModule, LovModuloModule, LovPersonasModule],
  declarations: [LoteModuloComponent],
  exports: [LoteModuloComponent]
})
export class LoteModuloModule { }
