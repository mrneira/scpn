import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { DevolucionComprasSinCodificarRoutingModule } from './devolucionComprasSinCodificar.routing';
import { DevolucionComprasSinCodificarComponent } from './componentes/devolucionComprasSinCodificar.component';
import { CabeceraModule } from './submodulos/cabecera/cabecera.module';
import { DetalleModule } from './submodulos/detalle/detalle.module';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { LovFuncionariosModule } from '../../../talentohumano/lov/funcionarios/lov.funcionarios.module';
import { LovIngresosModule } from '../../lov/ingresos/lov.ingresos.module';

@NgModule({
  imports: [SharedModule, DevolucionComprasSinCodificarRoutingModule, CabeceraModule, DetalleModule, JasperModule,
            LovFuncionariosModule, LovIngresosModule],
  declarations: [DevolucionComprasSinCodificarComponent]
})
export class DevolucionComprasSinCodificarModule { }
