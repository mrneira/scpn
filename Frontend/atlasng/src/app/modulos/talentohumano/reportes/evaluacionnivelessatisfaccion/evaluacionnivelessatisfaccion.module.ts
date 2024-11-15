import { NgModule } from '@angular/core';
import { SpinnerModule } from 'primeng/primeng';
import { SharedModule } from '../../../../util/shared/shared.module';
import { EvaluacionnivelessatisfaccionRoutingModule } from './evaluacionnivelessatisfaccion.routing';
import { EvaluacionNivelesSatisfaccionComponent } from './componentes/evaluacionnivelessatisfaccion.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import {LovFuncionariosModule} from '../../lov/funcionarios/lov.funcionarios.module';
import { LovEvaluacionmetaModule } from '../../lov/evaluacionmeta/lov.evaluacionmeta.module'
import { LovEvaluacionInternaModule } from '../../lov/evaluacioninterna/lov.evaluacioninterna.module'

@NgModule({
  imports: [SharedModule, EvaluacionnivelessatisfaccionRoutingModule, LovEvaluacionInternaModule,JasperModule, LovEvaluacionmetaModule,LovFuncionariosModule,SpinnerModule],
  declarations: [EvaluacionNivelesSatisfaccionComponent]
})
export class EvaluacionnivelessatisfaccionModule { }
