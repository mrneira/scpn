import { NgModule } from '@angular/core';
import { TooltipModule } from 'primeng/primeng';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ConsultaOperacionRoutingModule } from './consultaOperacion.routing';

import { ConsultaOperacionComponent } from './componentes/consultaOperacion.component';
import { ProductoModule } from '../../../generales/producto/producto.module';
import { TipoProductoModule } from '../../../generales/tipoproducto/tipoProducto.module';
import { DatosGeneralesModule } from './submodulos/datosgenerales/_datosGenerales.module';
import { LovPersonasModule } from '../../../personas/lov/personas/lov.personas.module';
import { LovPersonaVistaModule } from '../../../personas/lov/personavista/lov.personaVista.module';
import { LovOperacionCarteraModule } from '../../lov/operacion/lov.operacionCartera.module';
import { LovEstadoTransaccionModule } from '../../../tesoreria/lov/estadotransaccion/lov.estadotransaccion.module';
import { TablaAmortizacionModule } from './submodulos/tablaamortizacion/_tablaAmortizacion.module';
import { RubrosOperacionModule } from './submodulos/rubrosoperacion/_rubrosOperacion.module';
import { ValVencidosModule } from './submodulos/valvencidos/_valVencidos.module';
import { GarantiasOperacionModule } from './submodulos/garantias/_garantiasOperacion.module';
import { TransaccionesModule } from './submodulos/transacciones/_transacciones.module';

@NgModule({
  imports: [TooltipModule, SharedModule, ConsultaOperacionRoutingModule, LovOperacionCarteraModule,
    DatosGeneralesModule, ProductoModule, TipoProductoModule, LovPersonasModule, LovPersonaVistaModule, LovEstadoTransaccionModule,
    TablaAmortizacionModule, ValVencidosModule, RubrosOperacionModule, GarantiasOperacionModule, TransaccionesModule],
  declarations: [ConsultaOperacionComponent]
})
export class ConsultaOperacionModule { }
