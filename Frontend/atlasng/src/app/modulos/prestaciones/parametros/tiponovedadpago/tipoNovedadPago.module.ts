import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { TipoNovedadPagoRoutingModule } from './tipoNovedadPago.routing';
import { LovProveedoresModule } from '../../../contabilidad/lov/proveedores/lov.proveedores.module';
import { TipoNovedadPagoComponent } from './componentes/tipoNovedadPago.component';
import {LovTipoBajaModule} from '../../../socios/lov/tipobaja/lov.tipoBaja.module';


@NgModule({
  imports: [SharedModule, TipoNovedadPagoRoutingModule , LovTipoBajaModule, LovProveedoresModule ],
  declarations: [TipoNovedadPagoComponent]
})
export class TipoNovedadPagoModule { }
