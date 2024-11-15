import {NgModule} from '@angular/core';
import {SharedModule} from '../../../../../../util/shared/shared.module';
import {DatosGeneralesRoutingModule} from './_datosGenerales.routing';
import {DatosGeneralesComponent} from './componentes/_datosGenerales.component';
import {SolicitudComponent} from './componentes/_solicitud.component';
import {ProductoModule} from '../../../../../generales/producto/producto.module';
import {TipoProductoModule} from '../../../../../generales/tipoproducto/tipoProducto.module';

@NgModule({
  imports: [SharedModule, DatosGeneralesRoutingModule, ProductoModule, TipoProductoModule],
  declarations: [DatosGeneralesComponent, SolicitudComponent],
  exports: [DatosGeneralesComponent, SolicitudComponent]
})
export class DatosGeneralesModule {}
