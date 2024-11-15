import {NgModule} from '@angular/core';
import {SharedModule} from '../../../../../util/shared/shared.module';
import {LovCantonesModule} from '../../../../generales/lov/cantones/lov.cantones.module';
import {DatosGeneralesRoutingModule} from './_datosGenerales.routing';
import {DatosGeneralesComponent} from './componentes/_datosGenerales.component';

import {LovPaisesModule} from '../../../../generales/lov/paises/lov.paises.module';
import {LovParroquiasModule} from '../../../../generales/lov/parroquias/lov.parroquias.module';
import {LovProvinciasModule} from '../../../../generales/lov/provincias/lov.provincias.module';
import {ProductoModule} from '../../../../generales/producto/producto.module';
import {TipoProductoModule} from '../../../../generales/tipoproducto/tipoProducto.module';


@NgModule({
  imports: [SharedModule, DatosGeneralesRoutingModule, ProductoModule, TipoProductoModule, LovPaisesModule, LovProvinciasModule,
    LovCantonesModule, LovParroquiasModule],
  declarations: [DatosGeneralesComponent],
  exports: [DatosGeneralesComponent]
})
export class DatosGeneralesModule {}
