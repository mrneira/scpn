import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { DevolucionBodegaRoutingModule } from './devolucionBodega.routing';
import { DevolucionBodegaComponent } from './componentes/devolucionBodega.component';
import { CabeceraModule } from './submodulos/cabecera/cabecera.module';
import { DetalleModule } from './submodulos/detalle/detalle.module';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { LovIngresosModule } from '../../lov/ingresos/lov.ingresos.module';
import { LovCodificadosModule } from '../../lov/codificados/lov.codificados.module';
import { LovFuncionariosModule } from '../../../talentohumano/lov/funcionarios/lov.funcionarios.module';

@NgModule({
  imports: [SharedModule, DevolucionBodegaRoutingModule, CabeceraModule, DetalleModule, JasperModule, LovIngresosModule, LovCodificadosModule, LovFuncionariosModule],
  declarations: [DevolucionBodegaComponent]
})
export class DevolucionBodegaModule { }
