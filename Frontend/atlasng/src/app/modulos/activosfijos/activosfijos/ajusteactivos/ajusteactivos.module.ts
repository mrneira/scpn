import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { AjusteActivosRoutingModule } from './ajusteactivos.routing';
import { AjusteActivosComponent } from './componentes/ajusteactivos.component';
import { CabeceraModule } from './submodulos/cabecera/cabecera.module';
import { DetalleModule } from './submodulos/detalle/detalle.module';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { LovAjustesModule } from '../../lov/ajustes/lov.ajustes.module';
import { LovFuncionariosModule } from '../../../talentohumano/lov/funcionarios/lov.funcionarios.module';

@NgModule({
  imports: [SharedModule, AjusteActivosRoutingModule, CabeceraModule, DetalleModule, JasperModule,LovAjustesModule, LovFuncionariosModule],
  declarations: [AjusteActivosComponent]
})
export class AjusteActivosModule { }
