import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { AnulacionGarRoutingModule } from './anulacionGar.routing';
import { AnulacionGarComponent } from './componentes/anulacionGar.component';
import { ProductoModule } from '../../../generales/producto/producto.module';
import { TipoProductoModule } from '../../../generales/tipoproducto/tipoProducto.module';
import { DatosGeneralesModule } from './../ingresogar/submodulos/datosgenerales/_datosGenerales.module';
import { AvaluoModule } from '../ingresogar/submodulos/avaluo/_avaluo.module';
import { LovPersonasModule } from '../../../personas/lov/personas/lov.personas.module';
import { LovOperacionGarModule } from '../../lov/operacion/lov.operacionGar.module';

@NgModule({
  imports: [SharedModule, AnulacionGarRoutingModule,
    DatosGeneralesModule, ProductoModule, TipoProductoModule, LovPersonasModule, LovOperacionGarModule, AvaluoModule],
  declarations: [AnulacionGarComponent]
})
export class AnulacionGarModule { }
