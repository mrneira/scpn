import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { IngresoGarRoutingModule } from './ingresoGar.routing';

import { IngresoGarComponent } from './componentes/ingresoGar.component';
import { ProductoModule } from '../../../generales/producto/producto.module';
import { TipoProductoModule } from '../../../generales/tipoproducto/tipoProducto.module';
import { DatosGeneralesModule } from './submodulos/datosgenerales/_datosGenerales.module';
import { AvaluoModule } from './submodulos/avaluo/_avaluo.module';

import { LovPersonasModule } from '../../../personas/lov/personas/lov.personas.module';
import { LovOperacionGarModule } from '../../lov/operacion/lov.operacionGar.module';


@NgModule({
  imports: [SharedModule, IngresoGarRoutingModule,
    DatosGeneralesModule, ProductoModule, TipoProductoModule, LovPersonasModule, LovOperacionGarModule,AvaluoModule],
    declarations: [IngresoGarComponent]
})
export class IngresoGarModule { }
