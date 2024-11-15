import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { SimulacionRoutingModule } from './simulacion.routing';
import { JasperModule } from './../../../util/componentes/jasper/jasper.module';

import { SimulacionComponent } from './componentes/simulacion.component';
import { ProductoModule } from '../../generales/producto/producto.module';
import { TipoProductoModule } from '../../generales/tipoproducto/tipoProducto.module';
import { DatosGeneralesModule } from './submodulos/datosgenerales/_datosGenerales.module';
import { LovPersonasModule } from '../../personas/lov/personas/lov.personas.module';
import { LovPersonaVistaModule } from '../../personas/lov/personavista/lov.personaVista.module';
import { TablaAmortizacionModule } from '../originacion/solicitudingreso/submodulos/tablaamortizacion/_tablaAmortizacion.module';

@NgModule({
  imports: [SharedModule, SimulacionRoutingModule, DatosGeneralesModule, ProductoModule,
    TipoProductoModule, LovPersonasModule, LovPersonaVistaModule, TablaAmortizacionModule, JasperModule],
  declarations: [SimulacionComponent]
})
export class SimulacionModule { }
