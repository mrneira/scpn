import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ConsolidadoSegurosRoutingModule } from './cuentasbatch.routing';
import { ConsolidadoSegurosComponent } from './componentes/cuentasbatch.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { ProductoModule } from '../../../generales/producto/producto.module';
import { TipoProductoModule } from '../../../generales/tipoproducto/tipoProducto.module';
import { LovCuentasContablesModule } from '../../../contabilidad/lov/cuentascontables/lov.cuentasContables.module';

@NgModule({
  imports: [SharedModule, ConsolidadoSegurosRoutingModule, JasperModule, ProductoModule, TipoProductoModule,LovCuentasContablesModule],
  declarations: [ConsolidadoSegurosComponent]

})
export class CuentasBatchModule { }
