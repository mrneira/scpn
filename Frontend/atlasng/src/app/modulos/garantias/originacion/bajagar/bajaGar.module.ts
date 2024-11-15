import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { BajaGarRoutingModule } from './bajaGar.routing';
import { BajaGarComponent } from './componentes/bajaGar.component';
import { DatosGeneralesComponent } from './tabs/datosgenerales/componentes/_datosGenerales.component';
import { OperacionGarComponent } from './tabs/datosgenerales/componentes/_operacionGar.component';
import { CamposGarComponent } from './tabs/datosgenerales/componentes/_camposGar.component';
import { AvaluoComponent } from './tabs/avaluo/componentes/_avaluo.component';
import { InscripcionComponent } from './tabs/inscripcion/componentes/_inscripcion.component';
import { ProductoModule } from '../../../generales/producto/producto.module';
import { TipoProductoModule } from '../../../generales/tipoproducto/tipoProducto.module';
import { LovPersonasModule } from '../../../personas/lov/personas/lov.personas.module';
import { LovOperacionGarModule } from '../../lov/operacion/lov.operacionGar.module';
import { LovPaisesModule } from '../../../generales/lov/paises/lov.paises.module';
import { LovProvinciasModule } from '../../../generales/lov/provincias/lov.provincias.module';
import { LovCantonesModule } from '../../../generales/lov/cantones/lov.cantones.module';
import { LovParroquiasModule } from '../../../generales/lov/parroquias/lov.parroquias.module';
import { DataListModule } from 'primeng/primeng';
import { LovCatalogosDetalleModule } from '../../../generales/lov/catalogosdetalle/lov.catalogosDetalle.module';

@NgModule({
  imports: [SharedModule, BajaGarRoutingModule,
    ProductoModule, TipoProductoModule, LovPersonasModule, LovOperacionGarModule, LovPaisesModule, LovProvinciasModule,
    LovCantonesModule, LovParroquiasModule, DataListModule, LovCatalogosDetalleModule],
  declarations: [BajaGarComponent, DatosGeneralesComponent, OperacionGarComponent, CamposGarComponent,
    AvaluoComponent, InscripcionComponent]
})
export class BajaGarModule { }
