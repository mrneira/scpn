import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { DevolucionComprasCodificadosRoutingModule } from './devolucionComprasCodificados.routing';
import { DevolucionComprasCodificadosComponent } from './componentes/devolucionComprasCodificados.component';
import { CabeceraModule } from './submodulos/cabecera/cabecera.module';
import { DetalleModule } from './submodulos/detalle/detalle.module';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { LovIngresosModule } from '../../lov/ingresos/lov.ingresos.module';

@NgModule({
  imports: [SharedModule, DevolucionComprasCodificadosRoutingModule, CabeceraModule, DetalleModule, JasperModule,
             LovIngresosModule],
  declarations: [DevolucionComprasCodificadosComponent]
})
export class DevolucionComprasCodificadosModule { }
