import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { RenovacionSeguroRoutingModule } from './renovacionSeguro.routing';

import { RenovacionSeguroComponent } from './componentes/renovacionSeguro.component';

import { LovPersonasModule } from '../../personas/lov/personas/lov.personas.module';
import { LovSegurosModule } from '../lov/seguros/lov.seguros.module';
import { DatosOperacionModule } from './submodulos/datosOperacion/_datosOperacion.module'
import { DatosGarantiaModule } from './submodulos/datosGarantia/_datosGarantia.module'
import { DatosGeneralesModule } from './submodulos/datosgenerales/_datosGenerales.module'
import { ProductoModule } from '../../generales/producto/producto.module';
import { TipoProductoModule } from '../../generales/tipoproducto/tipoProducto.module';
import { LovOperacionGarModule } from '../../garantias/lov/operacion/lov.operacionGar.module';
@NgModule({
  imports: [SharedModule, RenovacionSeguroRoutingModule, LovPersonasModule, LovSegurosModule, DatosOperacionModule, LovOperacionGarModule,
    DatosGarantiaModule,DatosGeneralesModule,ProductoModule,TipoProductoModule],
  declarations: [RenovacionSeguroComponent]
})
export class RenovacionSeguroModule { }
