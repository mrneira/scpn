import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { RequisitosHabilitantesRoutingModule } from './requisitoshabilitantes.routing';
import { RequisitosHabilitantesComponent } from './componentes/requisitoshabilitantes.component';

import { LovDesignacionesModule } from '../../lov/designaciones/lov.designaciones.module';
import { GestorDocumentalModule } from '../../../gestordocumental/gestordocumental.module';
@NgModule({
  imports: [SharedModule, RequisitosHabilitantesRoutingModule, LovDesignacionesModule, GestorDocumentalModule],
  declarations: [RequisitosHabilitantesComponent]
})
export class RequisitosHabilitantesModule { }
