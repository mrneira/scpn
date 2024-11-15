import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { StepsModule } from 'primeng/primeng';
import { SolicitudPrendarioRoutingModule } from './solicitudPrendario.routing';
import { SolicitudPrendarioComponent } from './componentes/solicitudPrendario.component';
import { ProductoModule } from '../../../generales/producto/producto.module';
import { TipoProductoModule } from '../../../generales/tipoproducto/tipoProducto.module';
import { DatosGeneralesModule } from './submodulos/datosgenerales/_datosGenerales.module';
import { LovPersonasModule } from '../../../personas/lov/personas/lov.personas.module';
import { LovPersonaVistaModule } from '../../../personas/lov/personavista/lov.personaVista.module';
import { LovOperacionGarModule } from '../../../garantias/lov/operacion/lov.operacionGar.module';
import { LovCotizadorSegurosModule } from "../../../seguros/lov/cotizador/lov.cotizador.module";
import { TablaAmortizacionModule } from '../solicitudingreso/submodulos/tablaamortizacion/_tablaAmortizacion.module';
import { CapacidadPagoModule } from './submodulos/capacidadpago/_capacidadPago.module';
import { CotizadorModule } from './submodulos/cotizador/_cotizador.module';

@NgModule({
  imports: [SharedModule, StepsModule, SolicitudPrendarioRoutingModule, DatosGeneralesModule, ProductoModule,
    TipoProductoModule, LovPersonasModule, LovPersonaVistaModule, LovOperacionGarModule, LovCotizadorSegurosModule, TablaAmortizacionModule, CapacidadPagoModule, CotizadorModule],
  declarations: [SolicitudPrendarioComponent]
})
export class SolicitudPrendarioModule { }
