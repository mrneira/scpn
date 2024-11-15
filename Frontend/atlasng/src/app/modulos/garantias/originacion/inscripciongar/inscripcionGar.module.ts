import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { InscripcionGarRoutingModule } from './inscripcionGar.routing';

import { InscripcionGarComponent } from './componentes/inscripcionGar.component';
import { ProductoModule } from '../../../generales/producto/producto.module';
import { TipoProductoModule } from '../../../generales/tipoproducto/tipoProducto.module';
import { DatosGeneralesModule } from './../ingresogar/submodulos/datosgenerales/_datosGenerales.module';
import { AvaluoModule } from '../ingresogar/submodulos/avaluo/_avaluo.module';

import { LovPersonasModule } from '../../../personas/lov/personas/lov.personas.module';
import { LovOperacionGarModule } from '../../lov/operacion/lov.operacionGar.module';
import { InscripcionModule } from './submodulos/inscripcion/_inscripcion.module';


@NgModule({
  imports: [SharedModule, InscripcionGarRoutingModule,
    DatosGeneralesModule, ProductoModule, TipoProductoModule, LovPersonasModule, LovOperacionGarModule, AvaluoModule, InscripcionModule],
    declarations: [InscripcionGarComponent]
})
export class InscripcionGarModule { }
