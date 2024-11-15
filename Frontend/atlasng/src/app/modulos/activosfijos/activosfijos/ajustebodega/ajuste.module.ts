import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { AjusteRoutingModule } from './ajuste.routing';
import { AjusteComponent } from './componentes/ajuste.component';
import { CabeceraModule } from './submodulos/cabecera/cabecera.module';
import { DetalleModule } from './submodulos/detalle/detalle.module';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { LovAjustesModule } from '../../lov/ajustes/lov.ajustes.module';
import { LovFuncionariosModule } from '../../../talentohumano/lov/funcionarios/lov.funcionarios.module';

@NgModule({
  imports: [SharedModule, AjusteRoutingModule, CabeceraModule, DetalleModule, JasperModule,LovAjustesModule, LovFuncionariosModule],
  declarations: [AjusteComponent]
})
export class AjusteModule { }
