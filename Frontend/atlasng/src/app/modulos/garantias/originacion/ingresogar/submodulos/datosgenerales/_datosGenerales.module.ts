import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { LovCantonesModule } from '../../../../../generales/lov/cantones/lov.cantones.module';
import { DatosGeneralesRoutingModule } from './_datosGenerales.routing';
import { DatosGeneralesComponent } from './componentes/_datosGenerales.component';
import { OperacionGarComponent } from './componentes/_operacionGar.component';
import { CamposGarComponent } from './componentes/_camposGar.component';

import { LovPaisesModule } from '../../../../../generales/lov/paises/lov.paises.module';
import { LovParroquiasModule } from '../../../../../generales/lov/parroquias/lov.parroquias.module';
import { LovProvinciasModule } from '../../../../../generales/lov/provincias/lov.provincias.module';
import { ProductoModule } from '../../../../../generales/producto/producto.module';
import { TipoProductoModule } from '../../../../../generales/tipoproducto/tipoProducto.module';
import { DataListModule } from 'primeng/primeng';
import { LovCatalogosDetalleModule } from '../../../../../generales/lov/catalogosdetalle/lov.catalogosDetalle.module';
import { LovOperacionGarModule } from '../../../../lov/operacion/lov.operacionGar.module';


@NgModule({
  imports: [SharedModule, DatosGeneralesRoutingModule, ProductoModule, TipoProductoModule, LovPaisesModule, LovProvinciasModule,
    LovCantonesModule, LovParroquiasModule, DataListModule, LovCatalogosDetalleModule, LovOperacionGarModule],
  declarations: [DatosGeneralesComponent, OperacionGarComponent, CamposGarComponent],
  exports: [DatosGeneralesComponent, OperacionGarComponent, CamposGarComponent]
})
export class DatosGeneralesModule { }
