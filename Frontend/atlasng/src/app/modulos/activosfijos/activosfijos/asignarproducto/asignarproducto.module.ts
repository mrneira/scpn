import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { AsignarProductoRoutingModule } from './asignarproducto.routing';
import { AsignarProductoComponent } from './componentes/asignarproducto.component';
import { CabeceraModule } from './submodulos/cabecera/cabecera.module';
import { DetalleModule } from './submodulos/detalle/detalle.module';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { LovEgresosModule } from '../../lov/egresos/lov.egresos.module';
import { LovFuncionariosModule } from '../../../talentohumano/lov/funcionarios/lov.funcionarios.module';
import { LovCodificadosModule } from '../../lov/codificados/lov.codificados.module';
@NgModule({
  imports: [SharedModule, AsignarProductoRoutingModule, CabeceraModule, DetalleModule, JasperModule, LovEgresosModule, LovFuncionariosModule,LovCodificadosModule],
  declarations: [AsignarProductoComponent]
})
export class AsignarProductoModule { }
