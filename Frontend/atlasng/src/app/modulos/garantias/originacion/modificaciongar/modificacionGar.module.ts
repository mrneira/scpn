import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ModificacionGarRoutingModule } from './modificacionGar.routing';

import { ModificacionGarComponent } from './componentes/modificacionGar.component';
import { ProductoModule } from '../../../generales/producto/producto.module';
import { TipoProductoModule } from '../../../generales/tipoproducto/tipoProducto.module';
import { DatosGeneralesModule } from './submodulos/datosgenerales/_datosGenerales.module';

import { LovPersonasModule } from '../../../personas/lov/personas/lov.personas.module';
import { LovOperacionGarModule } from '../../lov/operacion/lov.operacionGar.module';


@NgModule({
  imports: [SharedModule, ModificacionGarRoutingModule,
    DatosGeneralesModule, ProductoModule, TipoProductoModule, LovPersonasModule, LovOperacionGarModule],
    declarations: [ModificacionGarComponent]
})
export class ModificacionGarModule { }
