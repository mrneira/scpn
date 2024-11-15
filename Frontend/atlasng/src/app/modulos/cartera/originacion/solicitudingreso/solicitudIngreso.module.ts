import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { StepsModule } from 'primeng/primeng';
import { SolicitudIngresoRoutingModule } from './solicitudIngreso.routing';

import { SolicitudIngresoComponent } from './componentes/solicitudIngreso.component';
import { ProductoModule } from '../../../generales/producto/producto.module';
import { TipoProductoModule } from '../../../generales/tipoproducto/tipoProducto.module';
import { LovPersonasModule } from '../../../personas/lov/personas/lov.personas.module';
import { LovSolicitudesModule } from '../../lov/solicitudes/lov.solicitudes.module';

import { DatosModule } from './submodulos/datosgenerales/_datos.module';
import { TablaAmortizacionModule } from './submodulos/tablaamortizacion/_tablaAmortizacion.module';
import { PersonasRelacionModule } from './submodulos/personasrelacion/_personasRelacion.module';
import { DescuentosModule } from './submodulos/descuentos/_descuentos.module';
import { GarantiasCarModule } from './submodulos/garantias/_garantiasCar.module';
import { RequisitosModule } from './submodulos/requisitos/_requisitos.module';
import { ReportesModule } from './submodulos/reportes/_reportes.module';
import { DesembolsoModule } from './submodulos/desembolso/_desembolso.module';


@NgModule({
  imports: [SharedModule, StepsModule, SolicitudIngresoRoutingModule, LovSolicitudesModule, DatosModule,
    ProductoModule, TipoProductoModule, LovPersonasModule, TablaAmortizacionModule,
    PersonasRelacionModule, ReportesModule, RequisitosModule, DescuentosModule, GarantiasCarModule, DesembolsoModule],
  declarations: [SolicitudIngresoComponent]
})
export class SolicitudIngresoModule { }
