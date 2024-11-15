import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { ConsultaSeguroRoutingModule } from './consultaSeguro.routing';
import { ConsultaSeguroComponent } from './componentes/consultaSeguro.component';
import { LovPersonasModule } from '../../personas/lov/personas/lov.personas.module';
import { LovSegurosModule } from '../lov/seguros/lov.seguros.module';
import { DatosOperacionModule } from './submodulos/datosOperacion/_datosOperacion.module'
import { DatosGarantiaModule } from './submodulos/datosGarantia/_datosGarantia.module'
import { TablaPolizaModule } from './submodulos/tablaPoliza/_tablaPoliza.module'
import { TablaPolizaIncrementoModule } from './submodulos/tablaPolizaIncremento/_tablaPolizaIncremento.module'

@NgModule({
  imports: [SharedModule, ConsultaSeguroRoutingModule, LovPersonasModule, LovSegurosModule, DatosOperacionModule, DatosGarantiaModule, TablaPolizaModule, TablaPolizaIncrementoModule],
  declarations: [ConsultaSeguroComponent]
})
export class ConsultaSeguroModule { }
