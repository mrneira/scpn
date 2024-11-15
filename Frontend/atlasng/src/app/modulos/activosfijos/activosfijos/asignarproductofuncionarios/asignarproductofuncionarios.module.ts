import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { AsignarProductoFuncionariosRoutingModule } from './asignarproductofuncionarios.routing';
import { AsignarProductoFuncionariosComponent } from './componentes/asignarproductofuncionarios.component';
import { CabeceraModule } from './submodulos/cabecera/cabecera.module';
import { DetalleModule } from './submodulos/detalle/detalle.module';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { LovEgresosModule } from '../../lov/egresos/lov.egresos.module';

@NgModule({
  imports: [SharedModule, AsignarProductoFuncionariosRoutingModule, CabeceraModule, DetalleModule, JasperModule, LovEgresosModule],
  declarations: [AsignarProductoFuncionariosComponent]
})
export class AsignarProductoFuncionariosModule { }
