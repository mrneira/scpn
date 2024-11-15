import { NgModule } from '@angular/core';
import { SharedModule } from '../../util/shared/shared.module';
import { GestorDocumentalRoutingModule } from './gestordocumental.routing';
import { GestorDocumentalComponent } from './componentes/gestordocumental.component';

import { LovDesignacionesModule } from '../talentohumano/lov/designaciones/lov.designaciones.module';

@NgModule({
  imports: [SharedModule, GestorDocumentalRoutingModule, LovDesignacionesModule],
  exports: [GestorDocumentalComponent],
  declarations: [GestorDocumentalComponent]
})
export class GestorDocumentalModule { }


