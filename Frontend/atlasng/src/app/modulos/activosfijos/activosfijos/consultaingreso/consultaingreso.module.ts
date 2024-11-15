import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ConsultaIngresoRoutingModule } from './consultaingreso.routing';
import { ConsultaIngresoComponent } from './componentes/consultaingreso.component';
import { CabeceraModule } from './submodulos/cabecera/cabecera.module';
import { DetalleModule } from './submodulos/detalle/detalle.module';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { LovIngresosModule } from '../../lov/ingresos/lov.ingresos.module';
import { GestorDocumentalModule } from '../../../gestordocumental/gestordocumental.module';

@NgModule({
  imports: [SharedModule, ConsultaIngresoRoutingModule, CabeceraModule, DetalleModule, JasperModule, LovIngresosModule, GestorDocumentalModule],
  declarations: [ConsultaIngresoComponent]
})
export class ConsultaIngresoModule { }
