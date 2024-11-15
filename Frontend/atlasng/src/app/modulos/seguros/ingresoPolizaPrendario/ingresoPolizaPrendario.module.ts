import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { IngresoPolizaPrendarioRoutingModule } from './ingresoPolizaPrendario.routing';
import { IngresoPolizaPrendarioComponent } from './componentes/ingresoPolizaPrendario.component';
import { TablaAmortizacionModule } from './submodulos/tablaamortizacion/_tablaAmortizacion.module';
import { LovPersonasModule } from '../../personas/lov/personas/lov.personas.module';
import { LovPersonaVistaModule } from '../../personas/lov/personavista/lov.personaVista.module';
import { LovSegurosModule } from '../lov/seguros/lov.seguros.module';
import { DatosPolizaModule } from './submodulos/datosPoliza/_datosPoliza.module'
import { JasperModule } from '../../../util/componentes/jasper/jasper.module';

@NgModule({
  imports: [SharedModule, IngresoPolizaPrendarioRoutingModule,JasperModule,TablaAmortizacionModule ,LovPersonasModule, LovPersonaVistaModule, LovSegurosModule, DatosPolizaModule],
  declarations: [IngresoPolizaPrendarioComponent]
})
export class IngresoPolizaPrendarioModule { }
