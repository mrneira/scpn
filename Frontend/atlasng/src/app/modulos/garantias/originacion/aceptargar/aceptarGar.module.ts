import {NgModule} from '@angular/core';
import {SharedModule} from '../../../../util/shared/shared.module';
import {AceptarGarRoutingModule} from './aceptarGar.routing';

import {AceptarGarComponent} from './componentes/aceptarGar.component';
import { DatosGeneralesModule } from './../ingresogar/submodulos/datosgenerales/_datosGenerales.module';
import { AvaluoModule } from '../ingresogar/submodulos/avaluo/_avaluo.module';
import { InscripcionModule } from '../inscripciongar/submodulos/inscripcion/_inscripcion.module';

import {ProductoModule} from '../../../generales/producto/producto.module';
import {TipoProductoModule} from '../../../generales/tipoproducto/tipoProducto.module';

import {LovPersonasModule} from '../../../personas/lov/personas/lov.personas.module';
import {LovOperacionGarModule} from '../../lov/operacion/lov.operacionGar.module';
import {LovPaisesModule} from '../../../generales/lov/paises/lov.paises.module';
import {LovProvinciasModule} from '../../../generales/lov/provincias/lov.provincias.module';
import {LovCantonesModule} from '../../../generales/lov/cantones/lov.cantones.module';
import {LovParroquiasModule} from '../../../generales/lov/parroquias/lov.parroquias.module';
import {DataListModule} from 'primeng/primeng';
import {LovCatalogosDetalleModule} from '../../../generales/lov/catalogosdetalle/lov.catalogosDetalle.module';

@NgModule({
  imports: [SharedModule, AceptarGarRoutingModule,
    ProductoModule, TipoProductoModule, LovPersonasModule, LovOperacionGarModule, LovPaisesModule, LovProvinciasModule,
    LovCantonesModule, LovParroquiasModule, DataListModule, LovCatalogosDetalleModule, DatosGeneralesModule, 
    AvaluoModule, InscripcionModule],
  declarations: [AceptarGarComponent]
})
export class AceptarGarModule {}
