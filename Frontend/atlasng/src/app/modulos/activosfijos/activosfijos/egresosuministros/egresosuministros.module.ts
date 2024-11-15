import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { EgresoSuministrosRoutingModule } from './egresosuministros.routing';
import { EgresoSuministrosComponent } from './componentes/egresosuministros.component';
import { CabeceraModule } from './submodulos/cabecera/cabecera.module';
import { DetalleModule } from './submodulos/detalle/detalle.module';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { LovEgresosModule } from '../../lov/egresos/lov.egresos.module';
import { LovFuncionariosModule } from '../../../talentohumano/lov/funcionarios/lov.funcionarios.module';

@NgModule({
  imports: [SharedModule, EgresoSuministrosRoutingModule, CabeceraModule, DetalleModule, 
    JasperModule, LovEgresosModule, LovFuncionariosModule],
  declarations: [EgresoSuministrosComponent]
})
export class EgresoSuministrosModule { }
